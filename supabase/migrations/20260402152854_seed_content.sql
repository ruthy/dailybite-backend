-- ==========================================
-- MEAL PLANS: 7 days x 5 meals = 35 meals
-- Gluten-free, ~1150 cal/day
-- ==========================================

-- DAY 1
INSERT INTO public.meal_plans (day_number, meal_type, title, description, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, recipe_steps, sort_order) VALUES
(1, 'breakfast', 'Greek Yogurt Parfait', 'Creamy yogurt layered with fresh berries and gluten-free granola.',
 '[{"name":"Greek yogurt (plain)","amount":"200g","calories":130,"protein":20,"carbs":6,"fat":4},{"name":"Mixed berries","amount":"100g","calories":45,"protein":1,"carbs":11,"fat":0},{"name":"GF granola","amount":"30g","calories":130,"protein":3,"carbs":18,"fat":5},{"name":"Honey","amount":"1 tsp","calories":20,"protein":0,"carbs":5,"fat":0}]',
 325, 24, 40, 9, 4,
 '["Add yogurt to a bowl or glass.","Layer with mixed berries.","Top with gluten-free granola.","Drizzle with honey."]', 1),

(1, 'snack_am', 'Apple with Almond Butter', 'Crisp apple slices with creamy almond butter.',
 '[{"name":"Apple (medium)","amount":"1","calories":95,"protein":0,"carbs":25,"fat":0},{"name":"Almond butter","amount":"1 tbsp","calories":98,"protein":3,"carbs":3,"fat":9}]',
 193, 3, 28, 9, 4,
 '["Slice the apple.","Serve with almond butter for dipping."]', 2),

(1, 'lunch', 'Grilled Chicken & Quinoa Bowl', 'Herb-seasoned chicken breast over fluffy quinoa with roasted vegetables.',
 '[{"name":"Chicken breast","amount":"120g","calories":165,"protein":31,"carbs":0,"fat":4},{"name":"Quinoa (cooked)","amount":"100g","calories":120,"protein":4,"carbs":21,"fat":2},{"name":"Roasted zucchini","amount":"80g","calories":15,"protein":1,"carbs":3,"fat":0},{"name":"Cherry tomatoes","amount":"60g","calories":11,"protein":0,"carbs":2,"fat":0},{"name":"Olive oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5}]',
 351, 36, 26, 11, 3,
 '["Cook quinoa according to package directions.","Season chicken with herbs, salt, and pepper.","Grill chicken 6-7 min per side until cooked through.","Roast zucchini at 200C for 15 min.","Assemble bowl: quinoa, sliced chicken, vegetables.","Drizzle with olive oil."]', 3),

(1, 'snack_pm', 'Carrot Sticks & Hummus', 'Crunchy carrots with smooth homemade hummus.',
 '[{"name":"Carrots","amount":"100g","calories":41,"protein":1,"carbs":10,"fat":0},{"name":"Hummus","amount":"40g","calories":70,"protein":3,"carbs":6,"fat":4}]',
 111, 4, 16, 4, 4,
 '["Wash and peel carrots, cut into sticks.","Serve with hummus."]', 4),

(1, 'dinner', 'Baked Salmon with Sweet Potato', 'Omega-rich salmon fillet with roasted sweet potato and steamed broccoli.',
 '[{"name":"Salmon fillet","amount":"120g","calories":208,"protein":25,"carbs":0,"fat":12},{"name":"Sweet potato","amount":"120g","calories":103,"protein":2,"carbs":24,"fat":0},{"name":"Broccoli","amount":"80g","calories":27,"protein":2,"carbs":5,"fat":0},{"name":"Lemon juice","amount":"1 tbsp","calories":4,"protein":0,"carbs":1,"fat":0}]',
 342, 29, 30, 12, 5,
 '["Preheat oven to 200C.","Place salmon on baking sheet, squeeze lemon over it.","Cube sweet potato, toss with a little oil, place on sheet.","Bake for 20-25 minutes.","Steam broccoli for 5 minutes.","Serve together."]', 5);

-- DAY 2
INSERT INTO public.meal_plans (day_number, meal_type, title, description, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, recipe_steps, sort_order) VALUES
(2, 'breakfast', 'Veggie Egg Scramble', 'Fluffy scrambled eggs with spinach, tomatoes, and feta cheese.',
 '[{"name":"Eggs","amount":"2","calories":140,"protein":12,"carbs":1,"fat":10},{"name":"Spinach","amount":"40g","calories":9,"protein":1,"carbs":1,"fat":0},{"name":"Cherry tomatoes","amount":"50g","calories":9,"protein":0,"carbs":2,"fat":0},{"name":"Feta cheese","amount":"20g","calories":53,"protein":4,"carbs":1,"fat":4},{"name":"Olive oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5}]',
 251, 17, 5, 19, 1,
 '["Heat olive oil in a pan.","Add chopped tomatoes and spinach, cook 2 min.","Pour in beaten eggs, scramble until set.","Top with crumbled feta."]', 1),

(2, 'snack_am', 'Rice Cake with Avocado', 'Light rice cakes topped with smashed avocado and sea salt.',
 '[{"name":"Rice cakes","amount":"2","calories":70,"protein":1,"carbs":15,"fat":0},{"name":"Avocado","amount":"50g","calories":80,"protein":1,"carbs":4,"fat":7}]',
 150, 2, 19, 7, 3,
 '["Smash avocado with a fork.","Spread on rice cakes.","Sprinkle with sea salt and pepper."]', 2),

(2, 'lunch', 'Tuna Salad Lettuce Wraps', 'Light tuna salad wrapped in crisp lettuce leaves.',
 '[{"name":"Canned tuna (in water)","amount":"120g","calories":120,"protein":27,"carbs":0,"fat":1},{"name":"Greek yogurt","amount":"30g","calories":20,"protein":3,"carbs":1,"fat":0},{"name":"Celery","amount":"30g","calories":5,"protein":0,"carbs":1,"fat":0},{"name":"Red onion","amount":"15g","calories":6,"protein":0,"carbs":1,"fat":0},{"name":"Lettuce leaves","amount":"4","calories":8,"protein":1,"carbs":1,"fat":0},{"name":"Lemon juice","amount":"1 tsp","calories":2,"protein":0,"carbs":1,"fat":0}]',
 161, 31, 5, 1, 1,
 '["Drain tuna and place in a bowl.","Mix with yogurt, diced celery, and red onion.","Add lemon juice, salt, and pepper.","Spoon onto lettuce leaves and wrap."]', 3),

(2, 'snack_pm', 'Handful of Mixed Nuts', 'A satisfying mix of almonds, walnuts, and cashews.',
 '[{"name":"Mixed nuts","amount":"25g","calories":155,"protein":5,"carbs":6,"fat":14}]',
 155, 5, 6, 14, 2,
 '["Measure out a small handful of mixed nuts."]', 4),

(2, 'dinner', 'Turkey Stir-Fry with Rice Noodles', 'Lean turkey with colorful vegetables over gluten-free rice noodles.',
 '[{"name":"Ground turkey","amount":"120g","calories":170,"protein":21,"carbs":0,"fat":9},{"name":"Rice noodles","amount":"60g dry","calories":192,"protein":2,"carbs":44,"fat":0},{"name":"Bell pepper","amount":"60g","calories":15,"protein":0,"carbs":3,"fat":0},{"name":"Snap peas","amount":"50g","calories":21,"protein":1,"carbs":4,"fat":0},{"name":"Tamari (GF soy sauce)","amount":"1 tbsp","calories":10,"protein":1,"carbs":1,"fat":0},{"name":"Sesame oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5}]',
 448, 25, 52, 14, 3,
 '["Cook rice noodles according to package, drain.","Heat sesame oil in a wok or large pan.","Cook ground turkey until browned.","Add sliced bell pepper and snap peas, stir-fry 3 min.","Add tamari and noodles, toss together.","Serve hot."]', 5);

-- DAY 3
INSERT INTO public.meal_plans (day_number, meal_type, title, description, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, recipe_steps, sort_order) VALUES
(3, 'breakfast', 'Banana Oat Pancakes', 'Naturally sweet pancakes made with oats and banana — no flour needed.',
 '[{"name":"Banana (ripe)","amount":"1","calories":105,"protein":1,"carbs":27,"fat":0},{"name":"Eggs","amount":"2","calories":140,"protein":12,"carbs":1,"fat":10},{"name":"GF oats","amount":"40g","calories":150,"protein":5,"carbs":27,"fat":3},{"name":"Cinnamon","amount":"1/2 tsp","calories":3,"protein":0,"carbs":1,"fat":0}]',
 398, 18, 56, 13, 4,
 '["Mash banana in a bowl.","Add eggs, oats, and cinnamon, mix well.","Heat a non-stick pan over medium heat.","Pour small rounds, cook 2-3 min per side.","Serve with a few berries on top."]', 1),

(3, 'snack_am', 'Cucumber & Tzatziki', 'Cool cucumber slices with creamy tzatziki dip.',
 '[{"name":"Cucumber","amount":"120g","calories":18,"protein":1,"carbs":4,"fat":0},{"name":"Tzatziki","amount":"50g","calories":50,"protein":2,"carbs":3,"fat":3}]',
 68, 3, 7, 3, 1,
 '["Slice cucumber into rounds.","Serve with tzatziki for dipping."]', 2),

(3, 'lunch', 'Lentil & Vegetable Soup', 'Hearty and warming lentil soup packed with vegetables.',
 '[{"name":"Red lentils","amount":"60g dry","calories":210,"protein":14,"carbs":36,"fat":1},{"name":"Carrots","amount":"60g","calories":25,"protein":0,"carbs":6,"fat":0},{"name":"Celery","amount":"40g","calories":6,"protein":0,"carbs":1,"fat":0},{"name":"Onion","amount":"40g","calories":16,"protein":0,"carbs":4,"fat":0},{"name":"Garlic","amount":"1 clove","calories":4,"protein":0,"carbs":1,"fat":0},{"name":"Olive oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5}]',
 301, 14, 48, 6, 8,
 '["Heat olive oil, saute diced onion, carrot, and celery for 5 min.","Add garlic, cook 1 min.","Add lentils and 500ml water or broth.","Simmer 20-25 min until lentils are soft.","Season with salt, pepper, and cumin."]', 3),

(3, 'snack_pm', 'Dark Chocolate & Strawberries', 'A sweet treat with antioxidant-rich dark chocolate.',
 '[{"name":"Dark chocolate (70%+)","amount":"20g","calories":115,"protein":2,"carbs":8,"fat":8},{"name":"Strawberries","amount":"80g","calories":26,"protein":1,"carbs":6,"fat":0}]',
 141, 3, 14, 8, 2,
 '["Break chocolate into small pieces.","Wash and hull strawberries.","Enjoy together."]', 4),

(3, 'dinner', 'Herb-Crusted Cod with Roasted Vegetables', 'Flaky white fish with a herb topping and colorful roasted veggies.',
 '[{"name":"Cod fillet","amount":"140g","calories":130,"protein":28,"carbs":0,"fat":1},{"name":"Zucchini","amount":"80g","calories":14,"protein":1,"carbs":3,"fat":0},{"name":"Red bell pepper","amount":"60g","calories":19,"protein":1,"carbs":4,"fat":0},{"name":"Cherry tomatoes","amount":"60g","calories":11,"protein":0,"carbs":2,"fat":0},{"name":"Olive oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5},{"name":"Fresh herbs","amount":"1 tbsp","calories":2,"protein":0,"carbs":0,"fat":0}]',
 216, 30, 9, 6, 2,
 '["Preheat oven to 190C.","Place cod on baking sheet, press herbs on top.","Chop vegetables, toss with olive oil.","Roast everything for 18-20 min.","Serve fish over roasted vegetables."]', 5);

-- DAY 4
INSERT INTO public.meal_plans (day_number, meal_type, title, description, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, recipe_steps, sort_order) VALUES
(4, 'breakfast', 'Chia Seed Pudding', 'Overnight chia pudding with coconut milk and mango.',
 '[{"name":"Chia seeds","amount":"30g","calories":146,"protein":5,"carbs":12,"fat":9},{"name":"Coconut milk","amount":"200ml","calories":90,"protein":1,"carbs":2,"fat":9},{"name":"Mango","amount":"80g","calories":48,"protein":1,"carbs":12,"fat":0},{"name":"Honey","amount":"1 tsp","calories":20,"protein":0,"carbs":5,"fat":0}]',
 304, 7, 31, 18, 10,
 '["Mix chia seeds with coconut milk and honey.","Stir well, cover, and refrigerate overnight.","In the morning, top with diced mango."]', 1),

(4, 'snack_am', 'Boiled Egg & Cherry Tomatoes', 'Simple protein-packed snack.',
 '[{"name":"Egg (boiled)","amount":"1","calories":70,"protein":6,"carbs":0,"fat":5},{"name":"Cherry tomatoes","amount":"80g","calories":14,"protein":1,"carbs":3,"fat":0}]',
 84, 7, 3, 5, 1,
 '["Boil egg for 10 min, cool and peel.","Wash tomatoes.","Season with salt and pepper."]', 2),

(4, 'lunch', 'Chicken Caesar Salad (GF)', 'Classic Caesar made gluten-free with a yogurt-based dressing.',
 '[{"name":"Chicken breast","amount":"120g","calories":165,"protein":31,"carbs":0,"fat":4},{"name":"Romaine lettuce","amount":"100g","calories":17,"protein":1,"carbs":3,"fat":0},{"name":"Parmesan","amount":"15g","calories":60,"protein":4,"carbs":0,"fat":5},{"name":"Greek yogurt dressing","amount":"30g","calories":25,"protein":2,"carbs":2,"fat":1},{"name":"Lemon juice","amount":"1 tbsp","calories":4,"protein":0,"carbs":1,"fat":0}]',
 271, 38, 6, 10, 2,
 '["Grill or pan-fry chicken breast, slice.","Chop romaine lettuce.","Mix yogurt with lemon juice, garlic, and parmesan for dressing.","Toss lettuce with dressing.","Top with sliced chicken and extra parmesan."]', 3),

(4, 'snack_pm', 'Banana with Peanut Butter', 'A classic energy-boosting combo.',
 '[{"name":"Banana","amount":"1","calories":105,"protein":1,"carbs":27,"fat":0},{"name":"Peanut butter","amount":"1 tbsp","calories":94,"protein":4,"carbs":3,"fat":8}]',
 199, 5, 30, 8, 3,
 '["Slice banana.","Spread or dip with peanut butter."]', 4),

(4, 'dinner', 'Shrimp & Vegetable Rice Bowl', 'Juicy shrimp with sauteed vegetables over jasmine rice.',
 '[{"name":"Shrimp","amount":"120g","calories":100,"protein":24,"carbs":0,"fat":1},{"name":"Jasmine rice (cooked)","amount":"100g","calories":130,"protein":3,"carbs":28,"fat":0},{"name":"Broccoli","amount":"60g","calories":20,"protein":2,"carbs":4,"fat":0},{"name":"Carrots","amount":"40g","calories":16,"protein":0,"carbs":4,"fat":0},{"name":"Garlic","amount":"1 clove","calories":4,"protein":0,"carbs":1,"fat":0},{"name":"Olive oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5}]',
 310, 29, 37, 6, 3,
 '["Cook rice according to package.","Heat oil, saute garlic 30 sec.","Add shrimp, cook 2 min per side.","Add broccoli and carrots, stir-fry 3 min.","Serve over rice."]', 5);

-- DAY 5
INSERT INTO public.meal_plans (day_number, meal_type, title, description, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, recipe_steps, sort_order) VALUES
(5, 'breakfast', 'Smoothie Bowl', 'Thick blended smoothie topped with seeds and fruit.',
 '[{"name":"Frozen banana","amount":"1","calories":105,"protein":1,"carbs":27,"fat":0},{"name":"Frozen berries","amount":"80g","calories":36,"protein":1,"carbs":8,"fat":0},{"name":"Spinach","amount":"30g","calories":7,"protein":1,"carbs":1,"fat":0},{"name":"Almond milk","amount":"100ml","calories":15,"protein":0,"carbs":1,"fat":1},{"name":"Pumpkin seeds","amount":"10g","calories":55,"protein":3,"carbs":1,"fat":5},{"name":"Coconut flakes","amount":"10g","calories":65,"protein":1,"carbs":2,"fat":6}]',
 283, 7, 40, 12, 5,
 '["Blend banana, berries, spinach, and almond milk until thick.","Pour into a bowl.","Top with pumpkin seeds and coconut flakes."]', 1),

(5, 'snack_am', 'Edamame', 'Steamed edamame with sea salt.',
 '[{"name":"Edamame (shelled)","amount":"80g","calories":100,"protein":9,"carbs":8,"fat":4}]',
 100, 9, 8, 4, 4,
 '["Steam or microwave edamame for 3 min.","Sprinkle with sea salt."]', 2),

(5, 'lunch', 'Sweet Potato & Black Bean Bowl', 'A hearty plant-based bowl with roasted sweet potato.',
 '[{"name":"Sweet potato","amount":"150g","calories":129,"protein":2,"carbs":30,"fat":0},{"name":"Black beans","amount":"80g","calories":100,"protein":7,"carbs":18,"fat":0},{"name":"Avocado","amount":"40g","calories":64,"protein":1,"carbs":3,"fat":6},{"name":"Lime juice","amount":"1 tbsp","calories":4,"protein":0,"carbs":1,"fat":0},{"name":"Cilantro","amount":"5g","calories":1,"protein":0,"carbs":0,"fat":0}]',
 298, 10, 52, 6, 10,
 '["Cube sweet potato, roast at 200C for 25 min.","Warm black beans.","Slice avocado.","Assemble bowl with sweet potato, beans, avocado.","Squeeze lime and top with cilantro."]', 3),

(5, 'snack_pm', 'GF Rice Crackers & Cheese', 'Crunchy crackers with sliced cheese.',
 '[{"name":"GF rice crackers","amount":"30g","calories":120,"protein":1,"carbs":24,"fat":2},{"name":"Cheddar cheese","amount":"20g","calories":80,"protein":5,"carbs":0,"fat":7}]',
 200, 6, 24, 9, 0,
 '["Arrange crackers on a plate.","Top with sliced cheese."]', 4),

(5, 'dinner', 'Grilled Chicken Thighs with Greek Salad', 'Juicy chicken thighs with a fresh Mediterranean salad.',
 '[{"name":"Chicken thighs (skinless)","amount":"130g","calories":190,"protein":26,"carbs":0,"fat":9},{"name":"Cucumber","amount":"60g","calories":9,"protein":0,"carbs":2,"fat":0},{"name":"Tomato","amount":"60g","calories":11,"protein":1,"carbs":2,"fat":0},{"name":"Red onion","amount":"20g","calories":8,"protein":0,"carbs":2,"fat":0},{"name":"Olives","amount":"20g","calories":29,"protein":0,"carbs":2,"fat":3},{"name":"Feta cheese","amount":"20g","calories":53,"protein":4,"carbs":1,"fat":4}]',
 300, 31, 9, 16, 2,
 '["Season chicken thighs with oregano, salt, pepper.","Grill 6-7 min per side.","Dice cucumber, tomato, and red onion.","Toss with olives and crumbled feta.","Dress with olive oil and lemon juice.","Serve chicken alongside salad."]', 5);

-- DAY 6
INSERT INTO public.meal_plans (day_number, meal_type, title, description, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, recipe_steps, sort_order) VALUES
(6, 'breakfast', 'Avocado Toast on GF Bread', 'Smashed avocado on toasted gluten-free bread with a poached egg.',
 '[{"name":"GF bread","amount":"2 slices","calories":160,"protein":2,"carbs":30,"fat":4},{"name":"Avocado","amount":"60g","calories":96,"protein":1,"carbs":5,"fat":9},{"name":"Egg (poached)","amount":"1","calories":70,"protein":6,"carbs":0,"fat":5},{"name":"Chili flakes","amount":"pinch","calories":2,"protein":0,"carbs":0,"fat":0}]',
 328, 9, 35, 18, 5,
 '["Toast GF bread.","Mash avocado with salt and lemon.","Poach egg in simmering water for 3 min.","Spread avocado on toast, top with egg.","Sprinkle with chili flakes."]', 1),

(6, 'snack_am', 'Yogurt with Walnuts', 'Plain yogurt topped with crunchy walnuts.',
 '[{"name":"Greek yogurt","amount":"120g","calories":78,"protein":12,"carbs":4,"fat":2},{"name":"Walnuts","amount":"15g","calories":98,"protein":2,"carbs":2,"fat":10}]',
 176, 14, 6, 12, 1,
 '["Spoon yogurt into a bowl.","Top with chopped walnuts."]', 2),

(6, 'lunch', 'Mediterranean Stuffed Peppers', 'Bell peppers stuffed with rice, herbs, and vegetables.',
 '[{"name":"Bell peppers","amount":"2","calories":50,"protein":2,"carbs":10,"fat":0},{"name":"Brown rice (cooked)","amount":"80g","calories":88,"protein":2,"carbs":18,"fat":1},{"name":"Chickpeas","amount":"60g","calories":95,"protein":5,"carbs":16,"fat":2},{"name":"Feta cheese","amount":"20g","calories":53,"protein":4,"carbs":1,"fat":4},{"name":"Fresh herbs","amount":"1 tbsp","calories":2,"protein":0,"carbs":0,"fat":0}]',
 288, 13, 45, 7, 6,
 '["Preheat oven to 190C.","Cut tops off peppers, remove seeds.","Mix rice, chickpeas, herbs, and feta.","Stuff mixture into peppers.","Bake for 25-30 min."]', 3),

(6, 'snack_pm', 'Celery with Cream Cheese', 'Crisp celery filled with cream cheese.',
 '[{"name":"Celery stalks","amount":"3","calories":15,"protein":0,"carbs":3,"fat":0},{"name":"Cream cheese","amount":"30g","calories":100,"protein":2,"carbs":1,"fat":10}]',
 115, 2, 4, 10, 1,
 '["Wash and trim celery stalks.","Fill with cream cheese."]', 4),

(6, 'dinner', 'Lemon Herb Chicken with Roasted Potatoes', 'Tender chicken with crispy roasted baby potatoes.',
 '[{"name":"Chicken breast","amount":"130g","calories":179,"protein":34,"carbs":0,"fat":4},{"name":"Baby potatoes","amount":"120g","calories":93,"protein":2,"carbs":21,"fat":0},{"name":"Green beans","amount":"80g","calories":25,"protein":2,"carbs":6,"fat":0},{"name":"Lemon","amount":"1/2","calories":10,"protein":0,"carbs":3,"fat":0},{"name":"Olive oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5}]',
 347, 38, 30, 9, 4,
 '["Preheat oven to 200C.","Halve potatoes, toss with oil and roast 25 min.","Season chicken with lemon, herbs, salt.","Pan-fry or bake chicken until done.","Steam green beans for 4 min.","Serve together with lemon wedge."]', 5);

-- DAY 7
INSERT INTO public.meal_plans (day_number, meal_type, title, description, ingredients, calories, protein_g, carbs_g, fat_g, fiber_g, recipe_steps, sort_order) VALUES
(7, 'breakfast', 'Berry Protein Smoothie', 'A thick, protein-packed smoothie with berries and spinach.',
 '[{"name":"Frozen mixed berries","amount":"120g","calories":54,"protein":1,"carbs":13,"fat":0},{"name":"Banana","amount":"1/2","calories":53,"protein":1,"carbs":14,"fat":0},{"name":"Protein powder (GF)","amount":"1 scoop","calories":120,"protein":24,"carbs":3,"fat":1},{"name":"Almond milk","amount":"200ml","calories":30,"protein":1,"carbs":1,"fat":2},{"name":"Spinach","amount":"30g","calories":7,"protein":1,"carbs":1,"fat":0}]',
 264, 28, 32, 3, 4,
 '["Add all ingredients to a blender.","Blend until smooth.","Pour into a glass and enjoy."]', 1),

(7, 'snack_am', 'Orange & Almonds', 'Fresh orange segments with a few almonds.',
 '[{"name":"Orange","amount":"1","calories":62,"protein":1,"carbs":15,"fat":0},{"name":"Almonds","amount":"15g","calories":87,"protein":3,"carbs":3,"fat":7}]',
 149, 4, 18, 7, 3,
 '["Peel and segment the orange.","Enjoy with almonds."]', 2),

(7, 'lunch', 'Egg Fried Rice (GF)', 'Quick and flavorful fried rice with eggs and vegetables.',
 '[{"name":"Jasmine rice (cooked)","amount":"120g","calories":156,"protein":3,"carbs":34,"fat":0},{"name":"Eggs","amount":"2","calories":140,"protein":12,"carbs":1,"fat":10},{"name":"Peas","amount":"40g","calories":31,"protein":2,"carbs":5,"fat":0},{"name":"Carrots","amount":"40g","calories":16,"protein":0,"carbs":4,"fat":0},{"name":"Tamari","amount":"1 tbsp","calories":10,"protein":1,"carbs":1,"fat":0},{"name":"Sesame oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5}]',
 393, 18, 45, 15, 3,
 '["Heat sesame oil in a wok.","Add diced carrots and peas, stir-fry 2 min.","Push vegetables to side, scramble eggs.","Add cold rice, toss everything together.","Season with tamari.","Serve hot."]', 3),

(7, 'snack_pm', 'Dates with Tahini', 'Sweet dates drizzled with creamy tahini.',
 '[{"name":"Medjool dates","amount":"2","calories":133,"protein":1,"carbs":36,"fat":0},{"name":"Tahini","amount":"1 tsp","calories":30,"protein":1,"carbs":1,"fat":3}]',
 163, 2, 37, 3, 3,
 '["Split dates and remove pits.","Drizzle with tahini."]', 4),

(7, 'dinner', 'Beef & Broccoli Stir-Fry', 'Tender beef strips with broccoli in a savory gluten-free sauce.',
 '[{"name":"Beef sirloin","amount":"120g","calories":200,"protein":26,"carbs":0,"fat":10},{"name":"Broccoli","amount":"100g","calories":34,"protein":3,"carbs":7,"fat":0},{"name":"Brown rice (cooked)","amount":"80g","calories":88,"protein":2,"carbs":18,"fat":1},{"name":"Tamari","amount":"1 tbsp","calories":10,"protein":1,"carbs":1,"fat":0},{"name":"Ginger","amount":"1 tsp","calories":2,"protein":0,"carbs":0,"fat":0},{"name":"Sesame oil","amount":"1 tsp","calories":40,"protein":0,"carbs":0,"fat":5}]',
 374, 32, 26, 16, 4,
 '["Slice beef into thin strips.","Heat sesame oil in a wok.","Stir-fry beef 2-3 min, set aside.","Add broccoli and ginger, cook 3 min.","Return beef, add tamari, toss.","Serve over brown rice."]', 5);

-- ==========================================
-- GUT HEALTH RECIPES (13 anti-bloat recipes)
-- ==========================================
INSERT INTO public.gut_health_recipes (title, description, ingredients, steps, prep_time_minutes, calories, is_gluten_free, is_anti_bloat, sort_order) VALUES
('Ginger Lemon Detox Tea', 'A soothing warm drink that aids digestion and reduces bloating.', '["Fresh ginger (2 inches)","Lemon (1/2)","Hot water (250ml)","Honey (1 tsp, optional)"]', '["Peel and thinly slice ginger.","Place in a mug, pour hot water over.","Squeeze lemon juice in.","Steep 5 minutes.","Add honey if desired."]', 5, 15, true, true, 1),

('Peppermint Digestive Smoothie', 'A cooling smoothie that calms the digestive system.', '["Fresh peppermint leaves (10)","Banana (1/2)","Cucumber (50g)","Almond milk (200ml)","Ice cubes"]', '["Add all ingredients to a blender.","Blend until smooth.","Pour and drink immediately."]', 5, 95, true, true, 2),

('Anti-Bloat Cucumber Salad', 'A refreshing salad with natural diuretic properties.', '["Cucumber (1 large)","Fresh dill (2 tbsp)","Apple cider vinegar (1 tbsp)","Olive oil (1 tsp)","Sea salt"]', '["Thinly slice cucumber.","Chop fresh dill.","Whisk vinegar and olive oil.","Toss cucumber with dressing and dill.","Season with sea salt."]', 10, 55, true, true, 3),

('Turmeric Golden Soup', 'A warm anti-inflammatory soup that soothes the gut.', '["Carrots (2)","Sweet potato (1 small)","Turmeric (1 tsp)","Coconut milk (100ml)","Vegetable broth (300ml)","Ginger (1 tsp)"]', '["Peel and chop carrots and sweet potato.","Simmer in broth until soft (15 min).","Add turmeric, ginger, and coconut milk.","Blend until smooth.","Season with salt and pepper."]', 25, 180, true, true, 4),

('Fennel & Orange Salad', 'A crisp salad with fennel, known for reducing gas and bloating.', '["Fennel bulb (1)","Orange (1)","Olive oil (1 tbsp)","Lemon juice (1 tbsp)","Fresh mint leaves"]', '["Thinly slice fennel.","Peel and segment orange.","Arrange on a plate.","Drizzle with olive oil and lemon juice.","Top with mint leaves."]', 10, 120, true, true, 5),

('Papaya Digestive Bowl', 'Tropical papaya contains enzymes that help break down food.', '["Papaya (1/2)","Greek yogurt (100g)","Lime juice (1 tbsp)","Chia seeds (1 tsp)","Mint leaves"]', '["Scoop papaya into a bowl.","Top with yogurt.","Squeeze lime juice over.","Sprinkle chia seeds and mint."]', 5, 145, true, true, 6),

('Bone Broth with Herbs', 'Gut-healing bone broth sipped warm with fresh herbs.', '["Bone broth (300ml)","Fresh parsley (1 tbsp)","Fresh thyme (1 tsp)","Garlic (1 clove)","Sea salt"]', '["Heat bone broth in a saucepan.","Add minced garlic, simmer 5 min.","Pour into a mug.","Top with fresh parsley and thyme."]', 10, 45, true, true, 7),

('Zucchini Noodle Soup', 'A light and easy-to-digest soup with zucchini noodles.', '["Zucchini (2)","Chicken broth (400ml)","Garlic (2 cloves)","Olive oil (1 tsp)","Fresh basil","Parmesan (optional)"]', '["Spiralize zucchini into noodles.","Heat oil, saute garlic 1 min.","Add broth, bring to simmer.","Add zucchini noodles, cook 3 min.","Serve with basil and parmesan."]', 15, 75, true, true, 8),

('Probiotic Overnight Oats', 'Overnight oats with kefir for a gut-friendly breakfast.', '["GF oats (40g)","Kefir (150ml)","Blueberries (50g)","Flaxseed (1 tbsp)","Honey (1 tsp)"]', '["Mix oats with kefir in a jar.","Stir in flaxseed and honey.","Top with blueberries.","Cover and refrigerate overnight.","Eat cold in the morning."]', 5, 250, true, true, 9),

('Roasted Carrot & Ginger Soup', 'A velvety soup combining the gut-soothing power of ginger with sweet carrots.', '["Carrots (4 large)","Fresh ginger (1 inch)","Onion (1)","Vegetable broth (400ml)","Olive oil (1 tbsp)","Coconut cream (2 tbsp)"]', '["Roast chopped carrots at 200C for 20 min.","Saute onion and ginger in oil.","Add roasted carrots and broth.","Blend until smooth.","Swirl in coconut cream."]', 30, 160, true, true, 10),

('Warm Lemon Water with ACV', 'A simple morning ritual to kickstart digestion.', '["Warm water (250ml)","Lemon juice (1 tbsp)","Apple cider vinegar (1 tbsp)","Honey (1 tsp, optional)"]', '["Heat water until warm (not boiling).","Add lemon juice and ACV.","Stir in honey if desired.","Drink first thing in the morning."]', 2, 15, true, true, 11),

('Banana Ginger Nice Cream', 'A frozen dessert that is gentle on digestion.', '["Frozen bananas (2)","Fresh ginger (1/2 tsp grated)","Almond milk (2 tbsp)","Cinnamon (pinch)"]', '["Add frozen bananas, ginger, and almond milk to blender.","Blend until creamy like soft-serve.","Sprinkle with cinnamon.","Eat immediately or freeze 15 min."]', 5, 190, true, true, 12),

('Miso Vegetable Soup', 'A gentle probiotic-rich soup with soft vegetables.', '["White miso paste (1 tbsp)","Tofu (50g)","Wakame seaweed (1 tsp)","Green onion (1)","Water (350ml)","Spinach (30g)"]', '["Heat water until simmering (not boiling).","Dissolve miso paste in a little warm water, then add.","Add cubed tofu and wakame.","Simmer 3 min.","Add spinach, cook 1 min.","Garnish with sliced green onion."]', 10, 70, true, true, 13);

-- ==========================================
-- WORKOUTS (7 low-impact workouts)
-- ==========================================
INSERT INTO public.workouts (title, description, duration_minutes, difficulty, body_focus, video_url, is_low_impact, sort_order) VALUES
('Morning Wake-Up Stretch', 'Gentle full-body stretching routine to start your day feeling flexible and energized.', 7, 'beginner', 'stretch', 'https://www.youtube.com/watch?v=g_tea8ZNk5A', true, 1),
('Low-Impact Cardio Burn', 'Get your heart rate up without any jumping. Perfect for joints and apartments.', 10, 'beginner', 'full_body', 'https://www.youtube.com/watch?v=gC_L9qAHVJ8', true, 2),
('Core Strength Builder', 'Strengthen your core with beginner-friendly exercises. No crunches needed.', 8, 'beginner', 'core', 'https://www.youtube.com/watch?v=2pLT-olgUJs', true, 3),
('Upper Body Toning', 'Tone arms and shoulders using just your bodyweight. No equipment needed.', 10, 'beginner', 'upper', 'https://www.youtube.com/watch?v=efgRDBrfRSc', true, 4),
('Lower Body Sculpt', 'Strengthen legs and glutes with low-impact moves. Great for building stability.', 12, 'intermediate', 'lower', 'https://www.youtube.com/watch?v=p-UVuh4fui0', true, 5),
('Yoga Flow for Digestion', 'A calming yoga sequence that aids digestion and reduces bloating.', 10, 'beginner', 'full_body', 'https://www.youtube.com/watch?v=hbguV_f6VZA', true, 6),
('Evening Wind-Down', 'A relaxing stretching routine to release tension before bed.', 8, 'beginner', 'stretch', 'https://www.youtube.com/watch?v=sTANio_2E0Q', true, 7);
