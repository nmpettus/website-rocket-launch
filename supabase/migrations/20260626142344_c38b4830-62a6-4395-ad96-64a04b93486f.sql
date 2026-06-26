
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(UUID, TEXT) TO service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
