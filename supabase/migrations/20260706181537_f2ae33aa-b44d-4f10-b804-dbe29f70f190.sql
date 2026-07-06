
-- 1) Lock down SECURITY DEFINER functions: revoke from PUBLIC/anon; grant only to authenticated (needed in RLS) and service_role
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_active_subscription(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) TO authenticated, service_role;

-- 2) Explicit admin-only write policies on user_roles to prevent client-side role assignment/escalation
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;
CREATE POLICY "Admins can insert user roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
CREATE POLICY "Admins can update user roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete user roles" ON public.user_roles;
CREATE POLICY "Admins can delete user roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) Storage SELECT policy for book-pages bucket — entitled users can read
DROP POLICY IF EXISTS "Entitled users can read book pages" ON storage.objects;
CREATE POLICY "Entitled users can read book pages"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'book-pages'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR public.has_active_subscription(auth.uid(), 'live')
      OR public.has_active_subscription(auth.uid(), 'sandbox')
      OR EXISTS (
        SELECT 1
        FROM public.book_pages bp
        JOIN public.books b ON b.id = bp.book_id
        WHERE b.is_free = true
          AND position(b.slug in storage.objects.name) > 0
      )
    )
  );
