-- ==========================================
-- DEMO USER: Sarah Cohen
-- Simulates 7 days of app usage
-- ==========================================

-- Enable pgcrypto for crypt() and gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
DECLARE
  sarah_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
BEGIN

-- ==========================================
-- 1. AUTH USER
-- ==========================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data, raw_app_meta_data, aud, role)
VALUES (
  sarah_id,
  '00000000-0000-0000-0000-000000000000',
  'sarah@demo.dailybite.fit',
  extensions.crypt('Demo123!', extensions.gen_salt('bf')),
  now(),
  now() - interval '7 days',
  now(),
  '{"name": "Sarah Cohen"}',
  '{"provider": "email", "providers": ["email"]}',
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
VALUES (
  sarah_id,
  sarah_id,
  '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "sarah@demo.dailybite.fit"}',
  'email',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  now() - interval '7 days',
  now()
)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 2. PROFILE
-- ==========================================
INSERT INTO public.profiles (id, name, email, date_of_birth, height_cm, weight_kg, activity_level, goal, daily_calorie_target, lang, onboarding_completed, created_at)
VALUES (
  sarah_id,
  'Sarah Cohen',
  'sarah@demo.dailybite.fit',
  '1982-06-15',
  165,
  72,
  'moderate',
  'lose',
  1450,
  'en',
  true,
  now() - interval '7 days'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 3. WEIGHT LOGS (7 days, gradual loss)
-- ==========================================
INSERT INTO public.weight_logs (user_id, date, weight_kg, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '6 days', 72.0, now() - interval '6 days'),
  (sarah_id, CURRENT_DATE - interval '5 days', 71.8, now() - interval '5 days'),
  (sarah_id, CURRENT_DATE - interval '4 days', 71.5, now() - interval '4 days'),
  (sarah_id, CURRENT_DATE - interval '3 days', 71.6, now() - interval '3 days'),
  (sarah_id, CURRENT_DATE - interval '2 days', 71.3, now() - interval '2 days'),
  (sarah_id, CURRENT_DATE - interval '1 day',  71.0, now() - interval '1 day'),
  (sarah_id, CURRENT_DATE,                      70.7, now())
ON CONFLICT (user_id, date) DO NOTHING;

-- ==========================================
-- 4. WATER LOGS (7 days)
-- ==========================================
INSERT INTO public.water_logs (user_id, date, glasses, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '6 days', 6, now() - interval '6 days'),
  (sarah_id, CURRENT_DATE - interval '5 days', 7, now() - interval '5 days'),
  (sarah_id, CURRENT_DATE - interval '4 days', 8, now() - interval '4 days'),
  (sarah_id, CURRENT_DATE - interval '3 days', 8, now() - interval '3 days'),
  (sarah_id, CURRENT_DATE - interval '2 days', 8, now() - interval '2 days'),
  (sarah_id, CURRENT_DATE - interval '1 day',  7, now() - interval '1 day'),
  (sarah_id, CURRENT_DATE,                      8, now())
ON CONFLICT (user_id, date) DO NOTHING;

-- ==========================================
-- 5. MEAL LOGS (3 meals per day, varying daily totals)
-- ==========================================
-- Day 1: ~1380 cal total
INSERT INTO public.meal_logs (user_id, date, meal_type, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '6 days', 'breakfast',
   '[{"name":"Greek yogurt with berries","qty":"1 bowl"}]',
   380, 20, 45, 12, 'scan', now() - interval '6 days'),
  (sarah_id, CURRENT_DATE - interval '6 days', 'lunch',
   '[{"name":"Grilled chicken salad","qty":"1 plate"}]',
   520, 35, 30, 18, 'scan', now() - interval '6 days'),
  (sarah_id, CURRENT_DATE - interval '6 days', 'dinner',
   '[{"name":"Salmon with steamed vegetables","qty":"1 plate"}]',
   480, 32, 25, 22, 'scan', now() - interval '6 days');

-- Day 2: ~1420 cal total
INSERT INTO public.meal_logs (user_id, date, meal_type, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '5 days', 'breakfast',
   '[{"name":"Oatmeal with banana and almonds","qty":"1 bowl"}]',
   420, 14, 62, 12, 'scan', now() - interval '5 days'),
  (sarah_id, CURRENT_DATE - interval '5 days', 'lunch',
   '[{"name":"Turkey wrap with hummus","qty":"1 wrap"}]',
   480, 28, 42, 16, 'scan', now() - interval '5 days'),
  (sarah_id, CURRENT_DATE - interval '5 days', 'dinner',
   '[{"name":"Vegetable stir fry with tofu","qty":"1 plate"}]',
   520, 24, 48, 20, 'scan', now() - interval '5 days');

-- Day 3: ~1350 cal total
INSERT INTO public.meal_logs (user_id, date, meal_type, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '4 days', 'breakfast',
   '[{"name":"Smoothie bowl","qty":"1 bowl"}]',
   350, 12, 55, 8, 'scan', now() - interval '4 days'),
  (sarah_id, CURRENT_DATE - interval '4 days', 'lunch',
   '[{"name":"Quinoa and black bean bowl","qty":"1 bowl"}]',
   500, 22, 65, 14, 'scan', now() - interval '4 days'),
  (sarah_id, CURRENT_DATE - interval '4 days', 'dinner',
   '[{"name":"Baked chicken breast with sweet potato","qty":"1 plate"}]',
   500, 38, 40, 16, 'scan', now() - interval '4 days');

-- Day 4: ~1500 cal total
INSERT INTO public.meal_logs (user_id, date, meal_type, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '3 days', 'breakfast',
   '[{"name":"Avocado toast with egg","qty":"2 slices"}]',
   480, 18, 38, 28, 'scan', now() - interval '3 days'),
  (sarah_id, CURRENT_DATE - interval '3 days', 'lunch',
   '[{"name":"Mediterranean salad with feta","qty":"1 plate"}]',
   520, 20, 35, 30, 'scan', now() - interval '3 days'),
  (sarah_id, CURRENT_DATE - interval '3 days', 'dinner',
   '[{"name":"Pasta with marinara sauce","qty":"1 plate"}]',
   500, 16, 72, 12, 'scan', now() - interval '3 days');

-- Day 5: ~1400 cal total
INSERT INTO public.meal_logs (user_id, date, meal_type, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '2 days', 'breakfast',
   '[{"name":"Cottage cheese with fruit","qty":"1 bowl"}]',
   320, 24, 30, 8, 'scan', now() - interval '2 days'),
  (sarah_id, CURRENT_DATE - interval '2 days', 'lunch',
   '[{"name":"Lentil soup with bread","qty":"1 bowl"}]',
   480, 20, 62, 10, 'scan', now() - interval '2 days'),
  (sarah_id, CURRENT_DATE - interval '2 days', 'dinner',
   '[{"name":"Grilled fish with roasted vegetables","qty":"1 plate"}]',
   600, 40, 30, 28, 'scan', now() - interval '2 days');

-- Day 6: ~1380 cal total
INSERT INTO public.meal_logs (user_id, date, meal_type, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '1 day', 'breakfast',
   '[{"name":"Egg white omelette with spinach","qty":"1 plate"}]',
   280, 26, 8, 14, 'scan', now() - interval '1 day'),
  (sarah_id, CURRENT_DATE - interval '1 day', 'lunch',
   '[{"name":"Chicken Caesar salad (light dressing)","qty":"1 plate"}]',
   520, 35, 22, 28, 'scan', now() - interval '1 day'),
  (sarah_id, CURRENT_DATE - interval '1 day', 'dinner',
   '[{"name":"Zucchini noodles with turkey meatballs","qty":"1 plate"}]',
   580, 38, 28, 30, 'scan', now() - interval '1 day');

-- Day 7 (today): ~1350 cal total
INSERT INTO public.meal_logs (user_id, date, meal_type, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source, created_at) VALUES
  (sarah_id, CURRENT_DATE, 'breakfast',
   '[{"name":"Protein shake with berries","qty":"1 glass"}]',
   300, 30, 25, 6, 'scan', now()),
  (sarah_id, CURRENT_DATE, 'lunch',
   '[{"name":"Tuna salad on mixed greens","qty":"1 plate"}]',
   450, 35, 15, 24, 'scan', now()),
  (sarah_id, CURRENT_DATE, 'dinner',
   '[{"name":"Herb roasted chicken with broccoli","qty":"1 plate"}]',
   600, 42, 20, 30, 'scan', now());

-- ==========================================
-- 6. WORKOUT LOGS (5 of 7 days, skip days 3 and 6)
-- ==========================================
-- Day 1
INSERT INTO public.workout_logs (user_id, workout_id, date, completed, created_at)
SELECT sarah_id, id, (CURRENT_DATE - interval '6 days')::date, true, now() - interval '6 days'
FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 0;

-- Day 2
INSERT INTO public.workout_logs (user_id, workout_id, date, completed, created_at)
SELECT sarah_id, id, (CURRENT_DATE - interval '5 days')::date, true, now() - interval '5 days'
FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 1;

-- Day 3: skipped

-- Day 4
INSERT INTO public.workout_logs (user_id, workout_id, date, completed, created_at)
SELECT sarah_id, id, (CURRENT_DATE - interval '3 days')::date, true, now() - interval '3 days'
FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 2;

-- Day 5
INSERT INTO public.workout_logs (user_id, workout_id, date, completed, created_at)
SELECT sarah_id, id, (CURRENT_DATE - interval '2 days')::date, true, now() - interval '2 days'
FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 3;

-- Day 6: skipped

-- Day 7 (today)
INSERT INTO public.workout_logs (user_id, workout_id, date, completed, created_at)
SELECT sarah_id, id, CURRENT_DATE, true, now()
FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 4;

-- ==========================================
-- 7. BLOATING LOGS (4 of 7 days)
-- ==========================================
INSERT INTO public.bloating_logs (user_id, date, severity, triggers, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '6 days', 4, '["Dairy","Stress"]',  now() - interval '6 days'),
  (sarah_id, CURRENT_DATE - interval '4 days', 3, '["Large meal"]',      now() - interval '4 days'),
  (sarah_id, CURRENT_DATE - interval '2 days', 2, '["Caffeine"]',        now() - interval '2 days'),
  (sarah_id, CURRENT_DATE,                      1, '[]',                  now());

-- ==========================================
-- 8. DAILY CHECK-INS (all 7 days)
-- ==========================================
INSERT INTO public.daily_checkins (user_id, date, logged_meal, logged_water, did_workout, created_at) VALUES
  (sarah_id, CURRENT_DATE - interval '6 days', true, true, true,  now() - interval '6 days'),
  (sarah_id, CURRENT_DATE - interval '5 days', true, true, true,  now() - interval '5 days'),
  (sarah_id, CURRENT_DATE - interval '4 days', true, true, false, now() - interval '4 days'),
  (sarah_id, CURRENT_DATE - interval '3 days', true, true, true,  now() - interval '3 days'),
  (sarah_id, CURRENT_DATE - interval '2 days', true, true, true,  now() - interval '2 days'),
  (sarah_id, CURRENT_DATE - interval '1 day',  true, true, false, now() - interval '1 day'),
  (sarah_id, CURRENT_DATE,                      true, true, true,  now())
ON CONFLICT (user_id, date) DO NOTHING;

END $$;
