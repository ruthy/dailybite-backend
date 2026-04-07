import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import './ShoppingPage.css'

const categories = [
  { name: 'Proteins', icon: '🥩', items: ['Chicken breast (500g)', 'Salmon fillets (2)', 'Cod fillet (1)', 'Ground turkey (250g)', 'Beef sirloin (120g)', 'Shrimp (120g)', 'Canned tuna (2 cans)', 'Eggs (12)'] },
  { name: 'Grains & Starches', icon: '🌾', items: ['Quinoa (200g)', 'Brown rice (200g)', 'Jasmine rice (200g)', 'Rice noodles (60g)', 'GF oats (200g)', 'GF bread (1 loaf)', 'Rice cakes', 'GF rice crackers'] },
  { name: 'Fruits', icon: '🍎', items: ['Bananas (4)', 'Apples (2)', 'Oranges (2)', 'Mixed berries (300g)', 'Strawberries (100g)', 'Mango (1)', 'Lemon (3)', 'Lime (1)', 'Papaya (1)'] },
  { name: 'Vegetables', icon: '🥦', items: ['Spinach (200g)', 'Broccoli (300g)', 'Zucchini (3)', 'Sweet potatoes (3)', 'Baby potatoes (200g)', 'Carrots (6)', 'Bell peppers (3)', 'Cucumber (2)', 'Cherry tomatoes (300g)', 'Celery', 'Green beans (100g)', 'Snap peas (50g)', 'Romaine lettuce', 'Red onion', 'Garlic', 'Ginger'] },
  { name: 'Dairy & Alternatives', icon: '🥛', items: ['Greek yogurt (500g)', 'Feta cheese (100g)', 'Parmesan (50g)', 'Cheddar (40g)', 'Cream cheese (30g)', 'Coconut milk (400ml)', 'Almond milk (500ml)', 'Kefir (150ml)'] },
  { name: 'Pantry', icon: '🫙', items: ['Almond butter', 'Peanut butter', 'Tahini', 'Hummus (200g)', 'Black beans (1 can)', 'Chickpeas (1 can)', 'Red lentils (200g)', 'Chia seeds', 'Pumpkin seeds', 'Mixed nuts', 'Almonds', 'Walnuts', 'Dates (4)', 'Coconut flakes', 'GF granola', 'Honey', 'Olive oil', 'Sesame oil', 'Tamari (GF soy sauce)', 'Apple cider vinegar'] },
  { name: 'Herbs & Spices', icon: '🌿', items: ['Fresh parsley', 'Fresh dill', 'Fresh basil', 'Fresh mint', 'Fresh cilantro', 'Cinnamon', 'Turmeric', 'Cumin', 'Oregano', 'Chili flakes', 'Black pepper', 'Sea salt'] },
  { name: 'Teas', icon: '🍵', items: ['Chamomile tea', 'Peppermint tea', 'Fennel tea', 'Ginger tea (or fresh ginger)'] },
]

export default function ShoppingPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [openCat, setOpenCat] = useState<number | null>(null)

  function toggle(item: string) {
    setChecked(prev => {
      const n = new Set(prev)
      if (n.has(item)) n.delete(item); else n.add(item)
      return n
    })
  }

  const totalItems = categories.reduce((s, c) => s + c.items.length, 0)
  const checkedCount = checked.size

  return (
    <div className="shopping-page">
      <PageHeader title="Weekly Shopping List" color="#4a6a3a" />

      <div className="shopping-progress">
        <div className="shopping-progress-text">
          <span>{checkedCount} of {totalItems} items</span>
          <span>{Math.round((checkedCount / totalItems) * 100)}%</span>
        </div>
        <div className="shopping-progress-bar">
          <div className="shopping-progress-fill" style={{ width: `${(checkedCount / totalItems) * 100}%` }} />
        </div>
      </div>

      <div className="shopping-categories">
        {categories.map((cat, ci) => {
          const catChecked = cat.items.filter(i => checked.has(i)).length
          const isOpen = openCat === ci
          return (
            <div key={ci} className="shopping-cat">
              <button
                className={`shopping-cat-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setOpenCat(isOpen ? null : ci)}
              >
                <span className="shopping-cat-icon">{cat.icon}</span>
                <div className="shopping-cat-info">
                  <strong>{cat.name}</strong>
                  <span>{catChecked}/{cat.items.length}</span>
                </div>
                <span className={`shopping-cat-arrow ${isOpen ? 'open' : ''}`}>▶</span>
              </button>

              {isOpen && (
                <div className="shopping-items">
                  {cat.items.map((item) => {
                    const isChecked = checked.has(item)
                    return (
                      <div
                        key={item}
                        className={`shopping-item ${isChecked ? 'checked' : ''}`}
                        onClick={() => toggle(item)}
                      >
                        <div className={`shopping-checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked ? '✓' : ''}
                        </div>
                        <span className={isChecked ? 'shopping-item-done' : ''}>{item}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {checkedCount > 0 && (
        <button className="shopping-clear" onClick={() => setChecked(new Set())}>
          Clear all checked items
        </button>
      )}
    </div>
  )
}
