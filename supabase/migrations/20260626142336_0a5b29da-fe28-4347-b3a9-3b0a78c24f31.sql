
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  price_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- has_active_subscription helper
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID, check_env TEXT DEFAULT 'sandbox')
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_uuid AND environment = check_env
    AND (
      (status IN ('active','trialing','past_due') AND (current_period_end IS NULL OR current_period_end > now()))
      OR (status = 'canceled' AND current_period_end > now())
    )
  );
$$;

-- Books
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  page_count INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.books TO anon, authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view books" ON public.books FOR SELECT TO anon, authenticated USING (true);

-- Book pages
CREATE TABLE public.book_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  narration_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(book_id, page_number)
);
CREATE INDEX idx_book_pages_book ON public.book_pages(book_id, page_number);
GRANT SELECT ON public.book_pages TO anon, authenticated;
GRANT ALL ON public.book_pages TO service_role;
ALTER TABLE public.book_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can read pages 1-3 of any book (preview), OR pages of free books
CREATE POLICY "Public can preview first 3 pages" ON public.book_pages
  FOR SELECT TO anon, authenticated
  USING (
    page_number <= 3
    OR EXISTS (SELECT 1 FROM public.books b WHERE b.id = book_id AND b.is_free = true)
    OR public.has_active_subscription(auth.uid(), 'sandbox')
    OR public.has_active_subscription(auth.uid(), 'live')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed a sample book for reader testing
INSERT INTO public.books (slug, title, description, cover_image_url, page_count, is_free, sort_order)
VALUES (
  'sample-maggie-story',
  'A Sample Maggie Story',
  'A short sample story used to demo the reader and read-aloud feature.',
  '/lovable-uploads/MaggieNewNBP.png',
  5,
  false,
  1
);

INSERT INTO public.book_pages (book_id, page_number, image_url, narration_text)
SELECT id, n, '/lovable-uploads/MaggieNewNBP.png',
  CASE n
    WHEN 1 THEN 'Hi! I am Maggie the Yorkie. Welcome to my reading club!'
    WHEN 2 THEN 'Every day I learn something new about God''s love.'
    WHEN 3 THEN 'God made the sun, the moon, and all the stars in the sky.'
    WHEN 4 THEN 'He made puppies too — even little ones like me.'
    WHEN 5 THEN 'God loves you very, very much. The end!'
  END
FROM public.books, generate_series(1, 5) AS n
WHERE slug = 'sample-maggie-story';
