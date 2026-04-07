import { useState } from 'react'
import './MetaBoost.css'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const shots = [
  {
    name: 'Ginger Lemon Fire',
    day: 'Monday',
    ingredients: ['1 inch fresh ginger (grated)', 'Juice of half a lemon', 'Pinch of cayenne pepper', '100ml warm water'],
    why: 'Boosts circulation, kickstarts digestion, and fires up your metabolism first thing.'
  },
  {
    name: 'Turmeric Golden Shot',
    day: 'Tuesday',
    ingredients: ['1/2 tsp turmeric', '1/4 tsp black pepper', 'Juice of half a lemon', '1 tsp honey', '100ml warm water'],
    why: 'Anti-inflammatory, supports joint health, and reduces bloating.'
  },
  {
    name: 'Apple Cider Vinegar Boost',
    day: 'Wednesday',
    ingredients: ['1 tbsp apple cider vinegar', '1 tsp honey', 'Juice of half a lemon', '150ml warm water'],
    why: 'Balances blood sugar, supports gut bacteria, and curbs cravings.'
  },
  {
    name: 'Green Detox Shot',
    day: 'Thursday',
    ingredients: ['Handful of spinach', '1/2 cucumber', 'Juice of 1 lemon', '1 inch ginger', '100ml water (blend & strain)'],
    why: 'Flushes toxins, delivers chlorophyll, and alkalises the body.'
  },
  {
    name: 'Cinnamon Metabolism Shot',
    day: 'Friday',
    ingredients: ['1/2 tsp cinnamon', '1 tsp honey', 'Juice of half a lemon', 'Pinch of ginger powder', '100ml warm water'],
    why: 'Regulates blood sugar, curbs sweet cravings, and boosts fat burning.'
  },
  {
    name: 'Detox Green',
    day: 'Saturday',
    ingredients: ['1 tsp spirulina or chlorella (GF)', 'Juice of half a lemon', '1 tsp honey', '60ml water'],
    why: 'Deep cellular detox, alkalises the body, boosts energy and supports fat loss.'
  },
  {
    name: 'Berry Antioxidant Shot',
    day: 'Sunday',
    ingredients: ['5 strawberries', '5 blueberries', 'Juice of half a lemon', '1 tsp honey', '100ml water (blend & strain)'],
    why: 'Loaded with antioxidants for cell repair, energy, and glowing skin.'
  },
]

export default function MetaBoost() {
  const todayIndex = new Date().getDay()
  const defaultDay = todayIndex === 0 ? 6 : todayIndex - 1
  const [selectedDay, setSelectedDay] = useState(defaultDay)
  const [done, setDone] = useState(false)

  const shot = shots[selectedDay]

  return (
    <div className="metaboost-inline">
      <div className="metaboost-info">
        <strong>Why morning shots?</strong> These natural shots boost metabolism, reduce inflammation, and support fat loss — taken on an empty stomach for maximum absorption.
      </div>

      <div className="metaboost-days">
        {days.map((d, i) => (
          <button
            key={d}
            className={`metaboost-day ${selectedDay === i ? 'active' : ''}`}
            onClick={() => { setSelectedDay(i); setDone(false) }}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="metaboost-recipe">
        <h3 className="metaboost-recipe-name">{shot.name}</h3>
        <p className="metaboost-recipe-day">{shot.day} — Take on empty stomach</p>

        <h4 className="metaboost-section-label">INGREDIENTS</h4>
        <ul className="metaboost-ingredients">
          {shot.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>

        <h4 className="metaboost-section-label">WHY IT WORKS</h4>
        <p className="metaboost-why">{shot.why}</p>

        <button
          className={`metaboost-done-btn ${done ? 'checked' : ''}`}
          onClick={() => setDone(!done)}
        >
          {done ? '✓ Done!' : '✓ Mark done'}
        </button>
      </div>
    </div>
  )
}
