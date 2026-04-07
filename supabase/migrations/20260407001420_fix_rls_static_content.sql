-- Fix RLS for static content tables — make them readable by any authenticated user
-- The old policy auth.role() = 'authenticated' doesn't work correctly in all cases

-- Drop old policies
DROP POLICY IF EXISTS "Authenticated users can read meal plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Authenticated users can read workouts" ON public.workouts;
DROP POLICY IF EXISTS "Authenticated users can read recipes" ON public.gut_health_recipes;

-- New policies — allow all reads (these are static content, not user data)
CREATE POLICY "Anyone can read meal plans" ON public.meal_plans FOR SELECT USING (true);
CREATE POLICY "Anyone can read workouts" ON public.workouts FOR SELECT USING (true);
CREATE POLICY "Anyone can read recipes" ON public.gut_health_recipes FOR SELECT USING (true);
