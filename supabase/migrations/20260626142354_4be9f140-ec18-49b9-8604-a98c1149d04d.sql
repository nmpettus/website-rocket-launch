
DROP POLICY IF EXISTS "Public can preview first 3 pages" ON public.book_pages;

CREATE POLICY "Page access" ON public.book_pages
  FOR SELECT TO anon, authenticated
  USING (
    page_number <= 3
    OR EXISTS (SELECT 1 FROM public.books b WHERE b.id = book_id AND b.is_free = true)
    OR EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.user_id = auth.uid()
        AND (
          (s.status IN ('active','trialing','past_due') AND (s.current_period_end IS NULL OR s.current_period_end > now()))
          OR (s.status = 'canceled' AND s.current_period_end > now())
        )
    )
  );
