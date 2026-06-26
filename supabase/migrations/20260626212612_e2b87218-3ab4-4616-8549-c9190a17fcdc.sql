
-- Role enum + user_roles table
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin write policies for books
DROP POLICY IF EXISTS "Admins manage books" ON public.books;
CREATE POLICY "Admins manage books" ON public.books
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT INSERT, UPDATE, DELETE ON public.books TO authenticated;

-- Admin write policies for book_pages
DROP POLICY IF EXISTS "Admins manage book_pages" ON public.book_pages;
CREATE POLICY "Admins manage book_pages" ON public.book_pages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT INSERT, UPDATE, DELETE ON public.book_pages TO authenticated;

-- Storage policies for book-pages bucket (bucket created via tool)
DROP POLICY IF EXISTS "Admins manage book-pages objects" ON storage.objects;
CREATE POLICY "Admins manage book-pages objects" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'book-pages' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'book-pages' AND public.has_role(auth.uid(), 'admin'));
