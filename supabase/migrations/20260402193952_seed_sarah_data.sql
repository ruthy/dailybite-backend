DO $$
DECLARE
  sid UUID := 'c431ee54-263c-490d-a0a1-8e1322324e5b';
BEGIN

-- Profile
INSERT INTO public.profiles (id, name, email, date_of_birth, height_cm, weight_kg, activity_level, goal, daily_calorie_target, lang, onboarding_completed)
VALUES (sid, 'Sarah Cohen', 'sarah@demo.dailybite.fit', '1982-06-15', 165, 72, 'moderate', 'lose', 1450, 'en', true)
ON CONFLICT (id) DO NOTHING;

-- Weight logs (7 days: 72.0 -> 70.7)
INSERT INTO public.weight_logs (user_id, date, weight_kg) VALUES
  (sid, CURRENT_DATE - 6, 72.0), (sid, CURRENT_DATE - 5, 71.8),
  (sid, CURRENT_DATE - 4, 71.5), (sid, CURRENT_DATE - 3, 71.6),
  (sid, CURRENT_DATE - 2, 71.3), (sid, CURRENT_DATE - 1, 71.0),
  (sid, CURRENT_DATE, 70.7)
ON CONFLICT (user_id, date) DO NOTHING;

-- Water logs (7 days)
INSERT INTO public.water_logs (user_id, date, glasses) VALUES
  (sid, CURRENT_DATE - 6, 6), (sid, CURRENT_DATE - 5, 7),
  (sid, CURRENT_DATE - 4, 8), (sid, CURRENT_DATE - 3, 8),
  (sid, CURRENT_DATE - 2, 8), (sid, CURRENT_DATE - 1, 7),
  (sid, CURRENT_DATE, 8)
ON CONFLICT (user_id, date) DO NOTHING;

-- Meal logs (3 meals/day x 7 days)
INSERT INTO public.meal_logs (user_id, date, meal_type, food_items, total_calories, total_protein_g, total_carbs_g, total_fat_g, source) VALUES
  (sid, CURRENT_DATE-6, 'breakfast', '[{"name":"Greek yogurt with berries"}]', 380, 20, 45, 12, 'scan'),
  (sid, CURRENT_DATE-6, 'lunch', '[{"name":"Grilled chicken salad"}]', 520, 35, 30, 18, 'scan'),
  (sid, CURRENT_DATE-6, 'dinner', '[{"name":"Salmon with steamed vegetables"}]', 480, 32, 25, 22, 'scan'),
  (sid, CURRENT_DATE-5, 'breakfast', '[{"name":"Oatmeal with banana and almonds"}]', 420, 14, 62, 12, 'scan'),
  (sid, CURRENT_DATE-5, 'lunch', '[{"name":"Turkey wrap with hummus"}]', 480, 28, 42, 16, 'scan'),
  (sid, CURRENT_DATE-5, 'dinner', '[{"name":"Vegetable stir fry with tofu"}]', 520, 24, 48, 20, 'scan'),
  (sid, CURRENT_DATE-4, 'breakfast', '[{"name":"Smoothie bowl"}]', 350, 12, 55, 8, 'scan'),
  (sid, CURRENT_DATE-4, 'lunch', '[{"name":"Quinoa and black bean bowl"}]', 500, 22, 65, 14, 'scan'),
  (sid, CURRENT_DATE-4, 'dinner', '[{"name":"Baked chicken with sweet potato"}]', 500, 38, 40, 16, 'scan'),
  (sid, CURRENT_DATE-3, 'breakfast', '[{"name":"Avocado toast with egg"}]', 480, 18, 38, 28, 'scan'),
  (sid, CURRENT_DATE-3, 'lunch', '[{"name":"Mediterranean salad with feta"}]', 520, 20, 35, 30, 'scan'),
  (sid, CURRENT_DATE-3, 'dinner', '[{"name":"Shrimp rice bowl"}]', 500, 16, 52, 12, 'scan'),
  (sid, CURRENT_DATE-2, 'breakfast', '[{"name":"Cottage cheese with fruit"}]', 320, 24, 30, 8, 'scan'),
  (sid, CURRENT_DATE-2, 'lunch', '[{"name":"Lentil soup"}]', 480, 20, 62, 10, 'scan'),
  (sid, CURRENT_DATE-2, 'dinner', '[{"name":"Grilled fish with roasted vegetables"}]', 600, 40, 30, 28, 'scan'),
  (sid, CURRENT_DATE-1, 'breakfast', '[{"name":"Egg white omelette with spinach"}]', 280, 26, 8, 14, 'scan'),
  (sid, CURRENT_DATE-1, 'lunch', '[{"name":"Chicken Caesar salad"}]', 520, 35, 22, 28, 'scan'),
  (sid, CURRENT_DATE-1, 'dinner', '[{"name":"Zucchini noodles with turkey meatballs"}]', 580, 38, 28, 30, 'scan'),
  (sid, CURRENT_DATE, 'breakfast', '[{"name":"Protein shake with berries"}]', 300, 30, 25, 6, 'scan'),
  (sid, CURRENT_DATE, 'lunch', '[{"name":"Tuna salad on mixed greens"}]', 450, 35, 15, 24, 'scan'),
  (sid, CURRENT_DATE, 'dinner', '[{"name":"Herb roasted chicken with broccoli"}]', 600, 42, 20, 30, 'scan');

-- Workout logs (5 of 7 days)
INSERT INTO public.workout_logs (user_id, workout_id, date, completed)
SELECT sid, id, (CURRENT_DATE - 6), true FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 0;
INSERT INTO public.workout_logs (user_id, workout_id, date, completed)
SELECT sid, id, (CURRENT_DATE - 5), true FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 1;
INSERT INTO public.workout_logs (user_id, workout_id, date, completed)
SELECT sid, id, (CURRENT_DATE - 3), true FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 2;
INSERT INTO public.workout_logs (user_id, workout_id, date, completed)
SELECT sid, id, (CURRENT_DATE - 2), true FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 3;
INSERT INTO public.workout_logs (user_id, workout_id, date, completed)
SELECT sid, id, CURRENT_DATE, true FROM public.workouts ORDER BY sort_order LIMIT 1 OFFSET 4;

-- Bloating logs (improving: 4 -> 1)
INSERT INTO public.bloating_logs (user_id, date, severity, triggers) VALUES
  (sid, CURRENT_DATE - 6, 4, '["Dairy","Stress"]'),
  (sid, CURRENT_DATE - 4, 3, '["Large meal"]'),
  (sid, CURRENT_DATE - 2, 2, '["Caffeine"]'),
  (sid, CURRENT_DATE, 1, '[]')
ON CONFLICT (user_id, date) DO NOTHING;

-- Daily checkins (7-day streak)
INSERT INTO public.daily_checkins (user_id, date, logged_meal, logged_water, did_workout) VALUES
  (sid, CURRENT_DATE - 6, true, true, true),
  (sid, CURRENT_DATE - 5, true, true, true),
  (sid, CURRENT_DATE - 4, true, true, false),
  (sid, CURRENT_DATE - 3, true, true, true),
  (sid, CURRENT_DATE - 2, true, true, true),
  (sid, CURRENT_DATE - 1, true, true, false),
  (sid, CURRENT_DATE, true, true, true)
ON CONFLICT (user_id, date) DO NOTHING;

END $$;
