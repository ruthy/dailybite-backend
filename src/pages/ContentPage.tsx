import { useLocation } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import './ContentPage.css'

const content: Record<string, { title: string; icon: string; color: string; items: Array<{ heading: string; text: string }> }> = {
  '/metaboost': {
    title: 'MetaBoost Morning Shots',
    icon: '🥤',
    color: '#8b5e3c',
    items: [
      { heading: 'What is it?', text: 'A simple morning drink you take on an empty stomach to kickstart your metabolism and reduce inflammation.' },
      { heading: 'Ginger Lemon Shot', text: 'Juice of 1/2 lemon + 1 inch fresh ginger grated + pinch of cayenne + 100ml warm water. Drink immediately.' },
      { heading: 'Turmeric Golden Shot', text: '1/2 tsp turmeric + 1/4 tsp black pepper + juice of 1/2 lemon + 1 tsp honey + 100ml warm water.' },
      { heading: 'Apple Cider Vinegar Shot', text: '1 tbsp ACV + 1 tsp honey + juice of 1/2 lemon + 150ml warm water. Stir well.' },
      { heading: 'Green Detox Shot', text: 'Blend: handful of spinach + 1/2 cucumber + juice of 1 lemon + 1 inch ginger + 100ml water. Strain and drink.' },
      { heading: 'When to drink', text: 'First thing in the morning, 20–30 minutes before breakfast. Rotate between the 4 shots throughout the week.' },
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
      { heading: '8. Sleep 7–8 hours', text: 'Sleep is when your body burns fat and repairs. Prioritize rest.' },
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
}

export default function ContentPage() {
  const location = useLocation()
  const page = content[location.pathname]

  if (!page) return <div className="content-page"><p>Page not found.</p></div>

  return (
    <div className="content-page">
      <PageHeader title={page.title} color={page.color} />
      <div className="content-items">
        {page.items.map((item, i) => (
          <div key={i} className="content-item">
            <h3>{item.heading}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
