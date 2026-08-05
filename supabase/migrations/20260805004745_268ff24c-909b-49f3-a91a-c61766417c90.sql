-- Add lazy monthly grant for yearly subscribers

CREATE OR REPLACE FUNCTION public.ensure_and_get_credit_balance(
  _user_id uuid,
  _environment text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sub record;
  _period date;
  _existing integer;
  _credits integer;
BEGIN
  _period := date_trunc('month', now())::date;

  SELECT COALESCE(SUM(delta), 0)::integer INTO _existing
  FROM public.credit_ledger
  WHERE user_id = _user_id
    AND environment = _environment
    AND period_start = _period;

  IF _existing > 0 THEN
    RETURN _existing;
  END IF;

  SELECT * INTO _sub
  FROM public.subscriptions
  WHERE user_id = _user_id
    AND environment = _environment
    AND (
      (status IN ('active', 'trialing', 'past_due') AND (current_period_end IS NULL OR current_period_end > now()))
      OR (status = 'canceled' AND current_period_end > now())
    )
  ORDER BY created_at DESC
  LIMIT 1;

  IF _sub IS NULL THEN
    RETURN 0;
  END IF;

  _credits := public.plan_monthly_credits(_sub.price_id);
  IF _credits > 0 THEN
    INSERT INTO public.credit_ledger (user_id, delta, reason, source_ref, period_start, environment)
    VALUES (
      _user_id,
      _credits,
      'Monthly grant',
      'lazy:' || _sub.stripe_subscription_id || ':' || _period,
      _period,
      _environment
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN public.get_credit_balance(_user_id, _environment);
END;
$$;
