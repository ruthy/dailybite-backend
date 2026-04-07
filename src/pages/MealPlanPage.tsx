import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
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
  const { profile, refreshProfile } = useAuth()
  const [selectedDay, setSelectedDay] = useState(1)
  const [meals, setMeals] = useState<Meal[]>([])
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Refresh profile to get latest calorie target
  useEffect(() => { refreshProfile() }, [])

  useEffect(() => {
    loadMeals()
  }, [selectedDay])

  async function loadMeals() {
    setLoading(true)
    try {
      const resp = await fetch(`/api/meals/${selectedDay}`)
      if (resp.ok) {
        const data = await resp.json()
        setMeals(data)
      } else {
        setMeals([])
      }
    } catch {
      setMeals([])
    }
    setLoading(false)
  }

  // Scale meals to match user's calorie target
  const baseTotalCals = meals.reduce((sum, m) => sum + m.calories, 0)
  const target = profile?.daily_calorie_target || 0
  const scale = target > 0 && baseTotalCals > 0 ? target / baseTotalCals : 1

  const scaledMeals = meals.map(m => ({
    ...m,
    calories: Math.round(m.calories * scale),
    protein_g: Math.round(m.protein_g * scale),
    carbs_g: Math.round(m.carbs_g * scale),
    fat_g: Math.round(m.fat_g * scale),
    ingredients: (m.ingredients || []).map((ing: any) => ({
      ...ing,
      calories: ing.calories ? Math.round(ing.calories * scale) : ing.calories,
      protein: ing.protein ? Math.round(ing.protein * scale) : ing.protein,
      carbs: ing.carbs ? Math.round(ing.carbs * scale) : ing.carbs,
      fat: ing.fat ? Math.round(ing.fat * scale) : ing.fat,
    })),
  }))

  const totalCals = scaledMeals.reduce((sum, m) => sum + m.calories, 0)

  return (
    <div className="mealplan-page">
      <PageHeader title="Weekly Meal Plan" color="#2d5a3a" />

      {/* Day total calories */}
      {scaledMeals.length > 0 && (
        <div className="mp-target-bar">
          <div className="mp-target-info">
            <span className="mp-target-label">Day {selectedDay} Total</span>
            <span className="mp-target-num">{totalCals} cal</span>
          </div>
          {profile?.daily_calorie_target && (
            <div className="mp-target-info">
              <span className="mp-target-label">Your target</span>
              <span className="mp-target-num">{profile.daily_calorie_target} cal</span>
            </div>
          )}
          {profile?.daily_calorie_target && (
            <div className="mp-target-remaining">
              {totalCals <= profile.daily_calorie_target
                ? `${profile.daily_calorie_target - totalCals} cal remaining`
                : `${totalCals - profile.daily_calorie_target} cal over target`
              }
            </div>
          )}
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
        ) : scaledMeals.length === 0 ? (
          <div className="mp-empty">
            <span className="mp-empty-icon">🍽️</span>
            <p>No meals added yet for this day.</p>
            <p className="mp-empty-hint">Meal plans will be added soon!</p>
          </div>
        ) : (
          scaledMeals.map((meal) => (
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
