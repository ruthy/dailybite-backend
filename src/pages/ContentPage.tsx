import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import './ContentPage.css'

const content: Record<string, { title: string; icon: string; color: string; items: Array<{ heading: string; text: string }> }> = {
  '/metaboost': {
    title: 'MetaBoost Morning Shots',
    icon: '🥤',
    color: '#8b5e3c',
    items: [
      { heading: 'How it works', text: 'Take one shot every morning on an empty stomach, 20–30 minutes before breakfast. Each day has a different recipe to keep your metabolism active and reduce inflammation. Follow the 7-day rotation every week.' },
      { heading: 'Monday — Ginger Lemon Fire', text: 'Juice of 1/2 lemon + 1 inch fresh ginger (grated) + pinch of cayenne pepper + 100ml warm water. Stir and drink immediately. Boosts circulation and kickstarts digestion.' },
      { heading: 'Tuesday — Turmeric Golden Shot', text: '1/2 tsp turmeric + 1/4 tsp black pepper + juice of 1/2 lemon + 1 tsp honey + 100ml warm water. Anti-inflammatory and supports joint health.' },
      { heading: 'Wednesday — Apple Cider Vinegar Boost', text: '1 tbsp apple cider vinegar + 1 tsp honey + juice of 1/2 lemon + 150ml warm water. Stir well. Balances blood sugar and supports gut bacteria.' },
      { heading: 'Thursday — Green Detox Shot', text: 'Blend: handful of spinach + 1/2 cucumber + juice of 1 lemon + 1 inch ginger + 100ml water. Strain and drink. Flushes toxins and delivers chlorophyll.' },
      { heading: 'Friday — Cinnamon Metabolism Shot', text: '1/2 tsp cinnamon + 1 tsp honey + juice of 1/2 lemon + pinch of ginger powder + 100ml warm water. Regulates blood sugar and curbs cravings.' },
      { heading: 'Saturday — Peppermint Digestive Shot', text: '5 fresh peppermint leaves (muddled) + juice of 1/2 lime + 1/2 tsp grated ginger + 100ml warm water. Calms bloating and prepares the gut for the day.' },
      { heading: 'Sunday — Berry Antioxidant Shot', text: 'Blend: 5 strawberries + 5 blueberries + juice of 1/2 lemon + 1 tsp honey + 100ml water. Strain and drink. Loaded with antioxidants for cell repair and energy.' },
      { heading: 'Tips for best results', text: 'Use warm water (not hot) to preserve nutrients. Always drink on an empty stomach. Wait 20–30 min before eating breakfast. Prepare ingredients the night before for quick mornings. Stay consistent — results build over time.' },
    ]
  },
  '/rules': {
    title: 'Key Rules',
    icon: '📋',
    color: '#8b5e3c',
    items: [
      { heading: '1. Eat 3 meals + 2 snacks daily', text: 'Keep your metabolism active by eating every 3–4 hours. Never skip meals.' },
      { heading: '2. Stay 100% gluten-free', text: 'All meals in this plan are gluten-free. Gluten causes inflammation and bloating in many women over 40.' },
      { heading: '3. Drink 8 glasses of water', text: 'Hydration is essential for digestion, energy, and fat burning. Use the water tracker to stay on target.' },
      { heading: '4. No eating after 8 PM', text: 'Give your body 12 hours of overnight fasting. This supports gut health and hormone balance.' },
      { heading: '5. Take the morning shot', text: 'Start each day with a MetaBoost shot to activate your metabolism before breakfast.' },
      { heading: '6. Move for 7–12 minutes daily', text: 'Low-impact exercise is enough. Follow the daily workout plan — no jumping, safe for joints.' },
      { heading: '7. Log everything', text: 'Track your meals, water, and workouts. What gets measured gets improved.' },
      { heading: '8. Sleep 7–8 hours', text: 'Sleep is when your body burns fat and repairs. During deep sleep your body produces growth hormone, which helps burn fat, repair muscles, and regulate appetite hormones. Less than 6 hours increases cortisol, which leads to belly fat storage. Go to bed and wake up at the same time every day. No screens 1 hour before bed — blue light disrupts melatonin. Do the Evening Wind-Down stretch 30 minutes before bed. Sleep-friendly foods: chamomile tea, tart cherries, walnuts, kiwi. Keep your room cool at 18–20°C.' },
      { heading: '9. Trust the process', text: 'Results take time. Follow the plan for 4 weeks before judging. Consistency beats perfection.' },
    ]
  },
  '/sleep': {
    title: 'Sleep & Recovery',
    icon: '😴',
    color: '#2c3e5a',
    items: [
      { heading: 'Why sleep matters', text: 'During deep sleep your body produces growth hormone, which helps burn fat, repair muscles, and regulate appetite hormones (leptin & ghrelin).' },
      { heading: 'Aim for 7–8 hours', text: 'Women over 40 need consistent, quality sleep. Less than 6 hours increases cortisol, which leads to belly fat storage.' },
      { heading: 'Create a sleep routine', text: 'Go to bed and wake up at the same time every day — even weekends. Your body craves rhythm.' },
      { heading: 'No screens 1 hour before bed', text: 'Blue light disrupts melatonin production. Read, stretch, or practice deep breathing instead.' },
      { heading: 'Evening stretch routine', text: 'Do the "Evening Wind-Down" workout from the Exercise Plan 30 minutes before bed to release tension.' },
      { heading: 'Sleep-friendly foods', text: 'Chamomile tea, tart cherries, walnuts, and kiwi contain natural compounds that promote sleep.' },
      { heading: 'Keep your room cool', text: 'Ideal bedroom temperature is 18–20°C (65–68°F). A cool room promotes deeper sleep.' },
    ]
  },
  '/shopping': {
    title: 'Weekly Shopping List',
    icon: '🛒',
    color: '#4a6a3a',
    items: [
      { heading: 'Proteins', text: 'Chicken breast (500g) · Salmon fillets (2) · Cod fillet (1) · Ground turkey (250g) · Beef sirloin (120g) · Shrimp (120g) · Canned tuna (2 cans) · Eggs (12)' },
      { heading: 'Grains & Starches', text: 'Quinoa (200g) · Brown rice (200g) · Jasmine rice (200g) · Rice noodles (60g) · GF oats (200g) · GF bread (1 loaf) · Rice cakes · GF rice crackers' },
      { heading: 'Fruits', text: 'Bananas (4) · Apples (2) · Oranges (2) · Mixed berries (300g) · Strawberries (100g) · Mango (1) · Lemon (3) · Lime (1) · Papaya (1)' },
      { heading: 'Vegetables', text: 'Spinach (200g) · Broccoli (300g) · Zucchini (3) · Sweet potatoes (3) · Baby potatoes (200g) · Carrots (6) · Bell peppers (3) · Cucumber (2) · Cherry tomatoes (300g) · Celery · Green beans (100g) · Snap peas (50g) · Romaine lettuce · Red onion · Garlic · Ginger' },
      { heading: 'Dairy & Alternatives', text: 'Greek yogurt (500g) · Feta cheese (100g) · Parmesan (50g) · Cheddar (40g) · Cream cheese (30g) · Coconut milk (400ml) · Almond milk (500ml) · Kefir (150ml)' },
      { heading: 'Pantry', text: 'Almond butter · Peanut butter · Tahini · Hummus (200g) · Black beans (1 can) · Chickpeas (1 can) · Red lentils (200g) · Chia seeds · Pumpkin seeds · Mixed nuts · Almonds · Walnuts · Dates (4) · Coconut flakes · GF granola · Honey · Olive oil · Sesame oil · Tamari (GF soy sauce) · Apple cider vinegar' },
      { heading: 'Herbs & Spices', text: 'Fresh parsley · Fresh dill · Fresh basil · Fresh mint · Fresh cilantro · Cinnamon · Turmeric · Cumin · Oregano · Chili flakes · Black pepper · Sea salt' },
      { heading: 'Teas', text: 'Chamomile tea · Peppermint tea · Fennel tea · Ginger tea (or fresh ginger)' },
    ]
  },
  '/yoga': {
    title: '30 Days Yoga',
    icon: '🧘‍♀️',
    color: '#6a5a8b',
    items: [
      { heading: 'Day 1–5: Foundation', text: 'Cat-Cow stretch (2 min) · Downward Dog hold (1 min) · Child\'s Pose (2 min) · Standing Forward Fold (1 min) · Corpse Pose relaxation (2 min). Total: 8 min/day.' },
      { heading: 'Day 6–10: Balance', text: 'Sun Salutation A (3 rounds) · Tree Pose each side (1 min) · Warrior I & II flow (3 min) · Seated twist each side (1 min) · Legs Up the Wall (2 min). Total: 10 min/day.' },
      { heading: 'Day 11–15: Flexibility', text: 'Sun Salutation B (2 rounds) · Pigeon Pose each side (2 min) · Lizard Lunge (2 min) · Butterfly stretch (1 min) · Supine spinal twist (2 min). Total: 10 min/day.' },
      { heading: 'Day 16–20: Core', text: 'Plank hold (1 min) · Boat Pose (3 rounds, 30 sec each) · Bridge Pose lifts (10 reps) · Side Plank each side (30 sec) · Wind-Relieving Pose (2 min). Total: 10 min/day.' },
      { heading: 'Day 21–25: Flow', text: 'Full Sun Salutation flow (5 min) · Warrior III balance (1 min each side) · Half Moon Pose (1 min each) · Camel Pose (1 min) · Savasana (2 min). Total: 12 min/day.' },
      { heading: 'Day 26–30: Deep Practice', text: 'Complete flow: Sun Salutations → Standing poses → Balances → Backbends → Twists → Cool down. Total: 12 min/day. You\'ve built a daily practice!' },
      { heading: 'Tips', text: 'Do yoga on an empty stomach or 2 hours after eating. Use a mat or soft surface. Focus on breath — inhale through nose, exhale slowly. Never force a pose. Consistency matters more than perfection.' },
    ]
  },
  '/fitness': {
    title: '30 Days Fitness',
    icon: '💪',
    color: '#8b3a3a',
    items: [
      { heading: 'Day 1–5: Start Easy', text: 'Wall push-ups (10) · Chair squats (10) · Standing calf raises (15) · Knee lifts (20) · Arm circles (30 sec each direction). Rest 30 sec between exercises. Total: 8 min.' },
      { heading: 'Day 6–10: Build Strength', text: 'Incline push-ups (10) · Bodyweight squats (12) · Glute bridges (12) · Standing side leg lifts (10 each) · Wall sit (30 sec). Total: 10 min.' },
      { heading: 'Day 11–15: Add Intensity', text: 'Push-ups on knees (8) · Sumo squats (12) · Donkey kicks (10 each) · Step-ups on stair (10 each) · Plank (30 sec). Total: 10 min.' },
      { heading: 'Day 16–20: Circuits', text: '2 rounds: Squats (12) → Push-ups (8) → Lunges (8 each) → Plank (30 sec) → Glute bridges (12). Rest 1 min between rounds. Total: 12 min.' },
      { heading: 'Day 21–25: Challenge', text: '3 rounds: Jump-free jacks (20) → Push-ups (10) → Reverse lunges (10 each) → Side plank (20 sec each) → Superman hold (30 sec). Total: 12 min.' },
      { heading: 'Day 26–30: Full Workout', text: '3 rounds: Squat to press (12) → Push-ups (12) → Walking lunges (10 each) → Plank (45 sec) → Glute bridges (15) → Cool-down stretch (2 min). Total: 15 min.' },
      { heading: 'Rules', text: 'All exercises are low-impact — no jumping. Rest when needed. Breathe out on effort. Do NOT skip the warm-up (arm circles + knee lifts). Drink water before and after. Progress is doing 1 more rep than yesterday.' },
    ]
  },
}

export default function ContentPage() {
  const location = useLocation()
  const page = content[location.pathname]
  const [openItem, setOpenItem] = useState<number | null>(null)

  if (!page) return <div className="content-page"><p>Page not found.</p></div>

  return (
    <div className="content-page">
      <PageHeader title={page.title} color={page.color} />
      <div className="content-items">
        {page.items.map((item, i) => (
          <div
            key={i}
            className={`content-item ${openItem === i ? 'open' : ''}`}
            onClick={() => setOpenItem(openItem === i ? null : i)}
          >
            <div className="content-item-header">
              <h3>{item.heading}</h3>
              <span className={`content-arrow ${openItem === i ? 'open' : ''}`}>▶</span>
            </div>
            {openItem === i && (
              <p className="content-item-text">{item.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
