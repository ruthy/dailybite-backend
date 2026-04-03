-- Update workout videos to match content properly
-- Each video is a real YouTube video matching the workout type

UPDATE public.workouts SET video_url = 'https://www.youtube.com/watch?v=4pKly2JojMw'
WHERE title = 'Morning Wake-Up Stretch';

UPDATE public.workouts SET video_url = 'https://www.youtube.com/watch?v=IT94xC35u6k'
WHERE title = 'Low-Impact Cardio Burn';

UPDATE public.workouts SET video_url = 'https://www.youtube.com/watch?v=1skBf6h2qlI'
WHERE title = 'Core Strength Builder';

UPDATE public.workouts SET video_url = 'https://www.youtube.com/watch?v=Wh1gRCGfJOg'
WHERE title = 'Upper Body Toning';

UPDATE public.workouts SET video_url = 'https://www.youtube.com/watch?v=6TjGBKSb4Fo'
WHERE title = 'Lower Body Sculpt';

UPDATE public.workouts SET video_url = 'https://www.youtube.com/watch?v=aKtHBmOEl2A'
WHERE title = 'Yoga Flow for Digestion';

UPDATE public.workouts SET video_url = 'https://www.youtube.com/watch?v=BiV4hLOK5Ko'
WHERE title = 'Evening Wind-Down';
