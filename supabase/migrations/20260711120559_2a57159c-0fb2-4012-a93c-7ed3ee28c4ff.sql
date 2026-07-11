DROP POLICY IF EXISTS "Admins can add books" ON public.books;
DROP POLICY IF EXISTS "Admins can edit books" ON public.books;
DROP POLICY IF EXISTS "Admins can add book pages" ON public.book_pages;
DROP POLICY IF EXISTS "Admins can edit book pages" ON public.book_pages;
DROP POLICY IF EXISTS "Page access" ON public.book_pages;
DROP POLICY IF EXISTS "Admins can manage reading history" ON public.reading_history;
DROP POLICY IF EXISTS "Entitled users can read book pages" ON storage.objects;

CREATE POLICY "Admins can add books"
ON public.books
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can edit books"
ON public.books
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can add book pages"
ON public.book_pages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admins can edit book pages"
ON public.book_pages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Page access"
ON public.book_pages
FOR SELECT
TO anon, authenticated
USING (
  page_number = ANY (ARRAY[4, 5, 6])
  OR EXISTS (
    SELECT 1 FROM public.books b
    WHERE b.id = book_pages.book_id AND b.is_free = true
  )
  OR EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = auth.uid()
      AND (
        (s.status IN ('active','trialing','past_due') AND (s.current_period_end IS NULL OR s.current_period_end > now()))
        OR (s.status = 'canceled' AND s.current_period_end > now())
      )
  )
);

CREATE POLICY "Admins can manage reading history"
ON public.reading_history
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Entitled users can read book pages"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'book-pages'
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
    )
    OR EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.user_id = auth.uid()
        AND (
          (s.status IN ('active','trialing','past_due') AND (s.current_period_end IS NULL OR s.current_period_end > now()))
          OR (s.status = 'canceled' AND s.current_period_end > now())
        )
    )
    OR EXISTS (
      SELECT 1
      FROM public.book_pages bp
      JOIN public.books b ON b.id = bp.book_id
      WHERE b.is_free = true
        AND bp.image_url = storage.objects.name
    )
  )
);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) TO service_role;
