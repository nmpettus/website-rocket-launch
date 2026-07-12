DROP POLICY IF EXISTS "Page access" ON public.book_pages;

CREATE POLICY "Page access"
ON public.book_pages
FOR SELECT
TO anon, authenticated
USING (
  page_number BETWEEN 1 AND 3
  OR EXISTS (
    SELECT 1 FROM public.books b
    WHERE b.id = book_pages.book_id AND b.is_free = true
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
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

DROP POLICY IF EXISTS "Entitled users can read book pages" ON storage.objects;

CREATE POLICY "Entitled users can read book pages"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'book-pages'
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
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
      WHERE bp.image_url = storage.objects.name
        AND (b.is_free = true OR bp.page_number BETWEEN 1 AND 3)
    )
  )
);