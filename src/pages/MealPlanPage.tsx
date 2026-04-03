import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/common/PageHeader'
import './MealPlanPage.css'

interface Meal {
  id: string
  day_number: number
  meal_type: string
  title: string
  description: string
  ingredients: Array<{ name: string; amount: string; calories: number; protein: number; carbs: number; fat: number }>
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  recipe_steps: string[]
  image_url: string | null
}

const mealTypeLabels: Record<string, string> = {
  breakfast: '🌅 Breakfast',
  snack_am: '🍎 Morning Snack',
  lunch: '🥗 Lunch',
  snack_pm: '🥜 Afternoon Snack',
  dinner: '🍽️ Dinner',
}

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function MealPlanPage() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [meals, setMeals] = useState<Meal[]>([])
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMeals()
  }, [selectedDay])

  async function loadMeals() {
    setLoading(true)
    const { data } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('day_number', selectedDay)
      .order('sort_order')
    setMeals(data || [])
    setLoading(false)
  }

  const totalCals = meals.reduce((sum, m) => sum + m.calories, 0)

  return (
    <div className="mealplan-page">
      <PageHeader title="Weekly Meal Plan" color="#2d5a3a" />

      {/* Daily total */}
      {meals.length > 0 && (
        <div className="mp-daily-total">
          <span>Day {selectedDay} Total</span>
          <strong>{totalCals} calories</strong>
        </div>
      )}

      {/* Day selector */}
      <div className="day-selector">
        {dayLabels.map((label, i) => (
          <button
            key={i}
            className={`day-btn ${selectedDay === i + 1 ? 'active' : ''}`}
            onClick={() => setSelectedDay(i + 1)}
          >
            <span className="day-label">{label}</span>
            <span className="day-num">{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Meals list */}
      <div className="meals-list">
        {loading ? (
          <div className="mp-empty">Loading meals...</div>
        ) : meals.length === 0 ? (
          <div className="mp-empty">
            <span className="mp-empty-icon">🍽️</span>
            <p>No meals added yet for this day.</p>
            <p className="mp-empty-hint">Meal plans will be added soon!</p>
          </div>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="meal-card" onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}>
              <div className="meal-card-header">
                <div>
                  <span className="meal-type">{mealTypeLabels[meal.meal_type] || meal.meal_type}</span>
                  <h3 className="meal-title">{meal.title}</h3>
                </div>
                <div className="meal-cals">{meal.calories} cal</div>
              </div>

              {expandedMeal === meal.id && (
                <div className="meal-detail">
                  {meal.description && <p className="meal-desc">{meal.description}</p>}
                  <div className="macro-row">
                    <div className="macro"><span className="macro-val">{meal.protein_g}g</span><span className="macro-label">Protein</span></div>
                    <div className="macro"><span className="macro-val">{meal.carbs_g}g</span><span className="macro-label">Carbs</span></div>
                    <div className="macro"><span className="macro-val">{meal.fat_g}g</span><span className="macro-label">Fat</span></div>
                  </div>

                  {meal.ingredients && meal.ingredients.length > 0 && (
                    <div className="meal-ingredients">
                      <h4>Ingredients</h4>
                      {meal.ingredients.map((ing, i) => (
                        <div key={i} className="ingredient-row">
                          <span>{ing.name}</span>
                          <span className="ing-amount">{ing.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {meal.recipe_steps && meal.recipe_steps.length > 0 && (
                    <div className="meal-steps">
                      <h4>Steps</h4>
                      {meal.recipe_steps.map((step, i) => (
                        <div key={i} className="step-row">
                          <span className="step-num">{i + 1}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
