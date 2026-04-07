ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_until DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS promo_code TEXT;
