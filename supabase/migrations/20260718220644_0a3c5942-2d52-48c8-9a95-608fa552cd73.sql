
CREATE OR REPLACE FUNCTION public.admin_list_members()
RETURNS TABLE (
  user_id uuid,
  email text,
  subscription_id uuid,
  status text,
  price_id text,
  environment text,
  current_period_end timestamptz,
  cancel_at_period_end boolean,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
           s.created_at
    FROM public.subscriptions s
    JOIN auth.users u ON u.id = s.user_id
    ORDER BY s.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_members() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_members() TO authenticated;
