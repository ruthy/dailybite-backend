-- ==========================================
-- PROFILES
-- ==========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  date_of_birth DATE,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  activity_level TEXT CHECK (activity_level IN ('sedentary','light','moderate','active','very_active')),
  goal TEXT CHECK (goal IN ('lose','maintain','gain')),
  daily_calorie_target INTEGER,
  lang TEXT DEFAULT 'en' CHECK (lang IN ('en','he')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- WATER TRACKING
-- ==========================================
CREATE TABLE public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  glasses INTEGER NOT NULL DEFAULT 0 CHECK (glasses >= 0 AND glasses <= 20),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ==========================================
-- MEAL PLANS (static content, admin-seeded)
-- ==========================================
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast','snack_am','lunch','snack_pm','dinner')),
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  calories INTEGER NOT NULL,
  protein_g NUMERIC NOT NULL,
  carbs_g NUMERIC NOT NULL,
  fat_g NUMERIC NOT NULL,
  fiber_g NUMERIC,
  is_gluten_free BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  recipe_steps JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0
);

-- ==========================================
-- MEAL SCAN LOGS
-- ==========================================
CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT CHECK (meal_type IN ('breakfast','snack_am','lunch','snack_pm','dinner','other')),
  photo_url TEXT,
  food_items JSONB NOT NULL DEFAULT '[]',
  total_calories INTEGER,
  total_protein_g NUMERIC,
  total_carbs_g NUMERIC,
  total_fat_g NUMERIC,
  source TEXT DEFAULT 'scan' CHECK (source IN ('scan','manual','meal_plan')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- WEIGHT / PROGRESS TRACKING
-- ==========================================
CREATE TABLE public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ==========================================
-- WORKOUTS (static content, admin-seeded)
-- ==========================================
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 5 AND 15),
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner','intermediate')),
  body_focus TEXT CHECK (body_focus IN ('full_body','upper','lower','core','stretch')),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_low_impact BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- ==========================================
-- WORKOUT COMPLETIONS
-- ==========================================
CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES public.workouts(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, workout_id, date)
);

-- ==========================================
-- BLOATING TRACKER
-- ==========================================
CREATE TABLE public.bloating_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
  triggers JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- GUT HEALTH RECIPES (static, admin-seeded)
-- ==========================================
CREATE TABLE public.gut_health_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  steps JSONB NOT NULL DEFAULT '[]',
  prep_time_minutes INTEGER,
  calories INTEGER,
  is_gluten_free BOOLEAN DEFAULT TRUE,
  is_anti_bloat BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ==========================================
-- DAILY CHECK-INS (streaks)
-- ==========================================
CREATE TABLE public.daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_meal BOOLEAN DEFAULT FALSE,
  logged_water BOOLEAN DEFAULT FALSE,
  did_workout BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_water_logs_user_date ON public.water_logs(user_id, date);
CREATE INDEX idx_meal_logs_user_date ON public.meal_logs(user_id, date);
CREATE INDEX idx_weight_logs_user_date ON public.weight_logs(user_id, date);
CREATE INDEX idx_workout_logs_user_date ON public.workout_logs(user_id, date);
CREATE INDEX idx_bloating_logs_user_date ON public.bloating_logs(user_id, date);
CREATE INDEX idx_daily_checkins_user_date ON public.daily_checkins(user_id, date);
CREATE INDEX idx_meal_plans_day ON public.meal_plans(day_number, sort_order);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bloating_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gut_health_recipes ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- WATER LOGS
CREATE POLICY "Users can view own water logs" ON public.water_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own water logs" ON public.water_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own water logs" ON public.water_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own water logs" ON public.water_logs FOR DELETE USING (auth.uid() = user_id);

-- MEAL LOGS
CREATE POLICY "Users can view own meal logs" ON public.meal_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal logs" ON public.meal_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal logs" ON public.meal_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal logs" ON public.meal_logs FOR DELETE USING (auth.uid() = user_id);

-- WEIGHT LOGS
CREATE POLICY "Users can view own weight logs" ON public.weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weight logs" ON public.weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weight logs" ON public.weight_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weight logs" ON public.weight_logs FOR DELETE USING (auth.uid() = user_id);

-- WORKOUT LOGS
CREATE POLICY "Users can view own workout logs" ON public.workout_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workout logs" ON public.workout_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout logs" ON public.workout_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout logs" ON public.workout_logs FOR DELETE USING (auth.uid() = user_id);

-- BLOATING LOGS
CREATE POLICY "Users can view own bloating logs" ON public.bloating_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bloating logs" ON public.bloating_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bloating logs" ON public.bloating_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bloating logs" ON public.bloating_logs FOR DELETE USING (auth.uid() = user_id);

-- DAILY CHECKINS
CREATE POLICY "Users can view own checkins" ON public.daily_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON public.daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON public.daily_checkins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checkins" ON public.daily_checkins FOR DELETE USING (auth.uid() = user_id);

-- STATIC CONTENT: any authenticated user can read
CREATE POLICY "Authenticated users can read meal plans" ON public.meal_plans FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read workouts" ON public.workouts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read recipes" ON public.gut_health_recipes FOR SELECT USING (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE BUCKET for meal photos
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-photos', 'meal-photos', false);

CREATE POLICY "Users can upload meal photos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own meal photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
