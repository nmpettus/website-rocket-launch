DROP POLICY IF EXISTS "Admins manage book-pages objects" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage reading history" ON public.reading_history;
DROP POLICY IF EXISTS "Admins can view all reading history" ON public.reading_history;

CREATE POLICY "Admins can upload book page objects"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'book-pages'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can update book page objects"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'book-pages'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
)
WITH CHECK (
  bucket_id = 'book-pages'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can view all reading history"
ON public.reading_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);
