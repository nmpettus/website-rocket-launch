
CREATE TABLE public.reading_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  first_read_at timestamptz NOT NULL DEFAULT now(),
  last_read_at timestamptz NOT NULL DEFAULT now(),
  last_page_read integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_history TO authenticated;
GRANT ALL ON public.reading_history TO service_role;

ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reading history"
  ON public.reading_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reading history"
  ON public.reading_history FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own reading history"
  ON public.reading_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading history"
  ON public.reading_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_reading_history_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_read_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_reading_history_updated
  BEFORE UPDATE ON public.reading_history
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_reading_history_updated_at();

CREATE INDEX idx_reading_history_user ON public.reading_history(user_id, last_read_at DESC);
