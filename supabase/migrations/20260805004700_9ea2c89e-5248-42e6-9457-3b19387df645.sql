-- Reading Credits System schema (retry with function drop)

DROP FUNCTION IF EXISTS public.admin_list_members();

-- 1. Content typing and pricing on books
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'picture_book';
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS credit_cost integer NOT NULL DEFAULT 3;

-- 2. Unlocks table (permanent ownership)
CREATE TABLE IF NOT EXISTS public.unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, book_id)
);

GRANT SELECT, INSERT, DELETE ON public.unlocks TO authenticated;
GRANT ALL ON public.unlocks TO service_role;

ALTER TABLE public.unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unlocks"
  ON public.unlocks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage unlocks"
  ON public.unlocks FOR ALL
  TO service_role
  USING (true);

-- 3. Credit ledger (append-only)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  delta integer not null,
  reason text not null,
  source_ref text,
  period_start date not null,
  environment text not null default 'sandbox',
  created_at timestamptz default now()
);

GRANT SELECT ON public.credit_ledger TO authenticated;
GRANT ALL ON public.credit_ledger TO service_role;

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ledger"
  ON public.credit_ledger FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage ledger"
  ON public.credit_ledger FOR ALL
  TO service_role
  USING (true);

-- 4. Refund requests
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  subscription_id uuid references public.subscriptions(id) on delete cascade not null,
  months_remaining integer not null,
  amount_cents integer not null,
  status text not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

GRANT SELECT, INSERT ON public.refund_requests TO authenticated;
GRANT ALL ON public.refund_requests TO service_role;

ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own refund requests"
  ON public.refund_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own refund requests"
  ON public.refund_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage refund requests"
  ON public.refund_requests FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Helper functions

-- Map plan price_id to monthly credit allowance
CREATE OR REPLACE FUNCTION public.plan_monthly_credits(_price_id text)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN _price_id = 'reading_club_monthly' THEN 7
    WHEN _price_id = 'reading_club_yearly' THEN 12
    ELSE 0
  END;
$$;

-- Current period start for a subscription (first of current month)
CREATE OR REPLACE FUNCTION public.current_credit_period(_current_period_start timestamptz)
RETURNS date
LANGUAGE sql
STABLE
AS $$
  SELECT date_trunc('month', COALESCE(_current_period_start, now()))::date;
$$;

-- Grant monthly credits (idempotent by source_ref)
CREATE OR REPLACE FUNCTION public.grant_monthly_credits(
  _user_id uuid,
  _price_id text,
  _period_start date,
  _source_ref text,
  _environment text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.credit_ledger
    WHERE user_id = _user_id
      AND source_ref = _source_ref
      AND environment = _environment
      AND period_start = _period_start
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.credit_ledger (user_id, delta, reason, source_ref, period_start, environment)
  VALUES (
    _user_id,
    public.plan_monthly_credits(_price_id),
    'Monthly grant',
    _source_ref,
    _period_start,
    _environment
  );
END;
$$;

-- Get remaining credits for current period
CREATE OR REPLACE FUNCTION public.get_credit_balance(
  _user_id uuid,
  _environment text
)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(delta), 0)::integer
  FROM public.credit_ledger
  WHERE user_id = _user_id
    AND environment = _environment
    AND period_start = date_trunc('month', now())::date;
$$;

-- Spend credits to unlock a book (atomic)
CREATE OR REPLACE FUNCTION public.spend_credits(_book_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _env text;
  _cost integer;
  _balance integer;
  _is_admin boolean;
BEGIN
  SELECT public.has_role(_user_id, 'admin') INTO _is_admin;
  IF _is_admin THEN
    INSERT INTO public.unlocks (user_id, book_id) VALUES (_user_id, _book_id)
    ON CONFLICT (user_id, book_id) DO NOTHING;
    RETURN jsonb_build_object('success', true, 'cost', 0);
  END IF;

  SELECT environment INTO _env
  FROM public.subscriptions
  WHERE user_id = _user_id
    AND environment IN ('sandbox', 'live')
    AND (
      (status IN ('active', 'trialing', 'past_due') AND (current_period_end IS NULL OR current_period_end > now()))
      OR (status = 'canceled' AND current_period_end > now())
    )
  ORDER BY created_at DESC
  LIMIT 1;

  IF _env IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No active subscription');
  END IF;

  SELECT COALESCE(credit_cost, 3) INTO _cost
  FROM public.books
  WHERE id = _book_id;

  IF _cost IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Book not found');
  END IF;

  SELECT public.get_credit_balance(_user_id, _env) INTO _balance;

  IF _balance < _cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not enough credits', 'cost', _cost, 'balance', _balance);
  END IF;

  INSERT INTO public.credit_ledger (user_id, delta, reason, source_ref, period_start, environment)
  VALUES (_user_id, -_cost, 'Unlock', _book_id::text, date_trunc('month', now())::date, _env);

  INSERT INTO public.unlocks (user_id, book_id) VALUES (_user_id, _book_id)
  ON CONFLICT (user_id, book_id) DO NOTHING;

  RETURN jsonb_build_object('success', true, 'cost', _cost, 'balance', _balance - _cost);
END;
$$;

-- Get refundable amount for yearly cancellations
CREATE OR REPLACE FUNCTION public.get_refundable_amount(
  _user_id uuid,
  _environment text
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH sub AS (
    SELECT *
    FROM public.subscriptions
    WHERE user_id = _user_id
      AND environment = _environment
    ORDER BY created_at DESC
    LIMIT 1
  )
  SELECT CASE
    WHEN sub.price_id = 'reading_club_yearly' THEN
      jsonb_build_object(
        'months_remaining', GREATEST(0, 12 - (EXTRACT(YEAR FROM age(now(), sub.current_period_start)) * 12 + EXTRACT(MONTH FROM age(now(), sub.current_period_start)))::int),
        'monthly_price_cents', 409,
        'amount_cents', GREATEST(0, 12 - (EXTRACT(YEAR FROM age(now(), sub.current_period_start)) * 12 + EXTRACT(MONTH FROM age(now(), sub.current_period_start)))::int) * 409
      )
    ELSE
      jsonb_build_object('months_remaining', 0, 'monthly_price_cents', 0, 'amount_cents', 0)
  END
  FROM sub;
$$;

-- Admin list members with credit balance
CREATE OR REPLACE FUNCTION public.admin_list_members()
RETURNS TABLE(
  user_id uuid,
  email text,
  subscription_id uuid,
  status text,
  price_id text,
  environment text,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean,
  created_at timestamp with time zone,
  credit_balance integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY
    SELECT s.user_id,
           u.email::text,
           s.id,
           s.status,
           s.price_id,
           s.environment,
           s.current_period_end,
           s.cancel_at_period_end,
           s.created_at,
           public.get_credit_balance(s.user_id, s.environment)
    FROM public.subscriptions s
    JOIN auth.users u ON u.id = s.user_id
    ORDER BY s.created_at DESC;
END;
$function$;
