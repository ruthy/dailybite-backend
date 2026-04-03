import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/common/PageHeader'
import './GutHealthPage.css'

const triggerOptions = ['Dairy', 'Gluten', 'Stress', 'Large meal', 'Caffeine', 'Sugar', 'Fried food', 'Alcohol']

const detoxPlan = {
  title: '48-Hour Gut Reset',
  description: 'A gentle 2-day plan to reduce bloating and reset your digestive system.',
  days: [
    {
      label: 'Day 1 — Cleanse',
      items: [
        { time: 'Morning', task: 'Warm lemon water with 1 tbsp apple cider vinegar', icon: '🍋' },
        { time: 'Breakfast', task: 'Ginger tea + small portion of papaya', icon: '🫖' },
        { time: 'Mid-morning', task: 'Peppermint tea + 8 almonds', icon: '🌿' },
        { time: 'Lunch', task: 'Steamed vegetables with quinoa (no oil, no seasoning except herbs)', icon: '🥗' },
        { time: 'Afternoon', task: 'Cucumber slices with lemon juice', icon: '🥒' },
        { time: 'Dinner', task: 'Bone broth or vegetable soup (no bread)', icon: '🍲' },
        { time: 'Evening', task: 'Chamomile tea before bed', icon: '🍵' },
        { time: 'All day', task: 'Drink at least 10 glasses of water', icon: '💧' },
      ]
    },
    {
      label: 'Day 2 — Restore',
      items: [
        { time: 'Morning', task: 'Warm water with ginger and honey', icon: '🍯' },
        { time: 'Breakfast', task: 'Probiotic yogurt with chia seeds and blueberries', icon: '🫐' },
        { time: 'Mid-morning', task: 'Fennel tea + a few walnuts', icon: '🫖' },
        { time: 'Lunch', task: 'Grilled chicken with steamed zucchini and sweet potato', icon: '🍗' },
        { time: 'Afternoon', task: 'Anti-bloat smoothie (banana, ginger, spinach, almond milk)', icon: '🥤' },
        { time: 'Dinner', task: 'Baked salmon with roasted carrots and fresh herbs', icon: '🐟' },
        { time: 'Evening', task: 'Peppermint tea + gentle stretching for 10 min', icon: '🧘‍♀️' },
        { time: 'All day', task: 'Continue 10+ glasses of water, avoid sugar and caffeine', icon: '💧' },
      ]
    }
  ],
  tips: [
    'Avoid gluten, dairy, sugar, caffeine, and alcohol for the full 48 hours.',
    'Eat slowly and chew thoroughly — aim for 20 chews per bite.',
    'Take a 15-minute walk after each meal to aid digestion.',
    'Go to bed early and aim for 8 hours of sleep both nights.',
    'Keep a journal of how you feel — notice changes in bloating and energy.'
  ]
}

export default function GutHealthPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'tracker' | 'detox' | 'recipes'>('tracker')
  const [severity, setSeverity] = useState(0)
  const [triggers, setTriggers] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [todayLogged, setTodayLogged] = useState(false)
  const [recipes, setRecipes] = useState<any[]>([])
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null)
  const [detoxChecks, setDetoxChecks] = useState<Set<string>>(new Set())
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (user) loadToday()
    loadRecipes()
  }, [user])

  async function loadToday() {
    const { data } = await supabase
      .from('bloating_logs')
      .select('*')
      .eq('user_id', user!.id)
      .eq('date', today)
      .single()
    if (data) {
      setSeverity(data.severity)
      setTriggers(data.triggers || [])
      setNotes(data.notes || '')
      setTodayLogged(true)
    }
  }

  async function loadRecipes() {
    const { data } = await supabase
      .from('gut_health_recipes')
      .select('*')
      .order('sort_order')
    setRecipes(data || [])
  }

  function toggleTrigger(t: string) {
    setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  function toggleDetoxCheck(key: string) {
    setDetoxChecks(prev => {
      const n = new Set(prev)
      if (n.has(key)) n.delete(key); else n.add(key)
      return n
    })
  }

  async function handleLog() {
    if (!user || severity === 0) return
    await supabase.from('bloating_logs').upsert({
      user_id: user.id,
      date: today,
      severity,
      triggers,
      notes,
    }, { onConflict: 'user_id,date' })
    setTodayLogged(true)
  }

  return (
    <div className="gut-page">
      <PageHeader title="Gut Health" color="#4a8a5a" />

      <div className="gut-tabs">
        <button className={`gut-tab ${tab === 'tracker' ? 'active' : ''}`} onClick={() => setTab('tracker')}>Tracker</button>
        <button className={`gut-tab ${tab === 'detox' ? 'active' : ''}`} onClick={() => setTab('detox')}>48h Detox</button>
        <button className={`gut-tab ${tab === 'recipes' ? 'active' : ''}`} onClick={() => setTab('recipes')}>Recipes</button>
      </div>

      {/* BLOATING TRACKER */}
      {tab === 'tracker' && (
        <div className="tracker-content">
          <div className="tracker-card">
            <h3>How's your bloating today?</h3>
            <div className="severity-row">
              {[1,2,3,4,5].map((level) => (
                <button
                  key={level}
                  className={`severity-btn ${severity === level ? 'active' : ''}`}
                  onClick={() => setSeverity(level)}
                >
                  <span className="severity-face">
                    {level === 1 ? '😊' : level === 2 ? '🙂' : level === 3 ? '😐' : level === 4 ? '😣' : '😫'}
                  </span>
                  <span className="severity-num">{level}</span>
                </button>
              ))}
            </div>

            <h3>What might have caused it?</h3>
            <div className="trigger-chips">
              {triggerOptions.map((t) => (
                <button
                  key={t}
                  className={`trigger-chip ${triggers.includes(t) ? 'active' : ''}`}
                  onClick={() => toggleTrigger(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="input-group">
              <label>Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling?"
                rows={3}
              />
            </div>

            {todayLogged ? (
              <button className="gut-btn saved" onClick={handleLog}>Update Log</button>
            ) : (
              <button className="gut-btn" onClick={handleLog} disabled={severity === 0}>Log Today</button>
            )}
          </div>
        </div>
      )}

      {/* 48-HOUR DETOX */}
      {tab === 'detox' && (
        <div className="detox-content">
          <div className="detox-header">
            <h2>{detoxPlan.title}</h2>
            <p>{detoxPlan.description}</p>
          </div>

          {detoxPlan.days.map((day, di) => (
            <div key={di} className="detox-day">
              <h3>{day.label}</h3>
              <div className="detox-items">
                {day.items.map((item, ii) => {
                  const key = `${di}-${ii}`
                  const checked = detoxChecks.has(key)
                  return (
                    <div key={ii} className={`detox-item ${checked ? 'checked' : ''}`} onClick={() => toggleDetoxCheck(key)}>
                      <div className="detox-check-box">{checked ? '✓' : ''}</div>
                      <span className="detox-icon">{item.icon}</span>
                      <div className="detox-info">
                        <span className="detox-time">{item.time}</span>
                        <span className="detox-task">{item.task}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="detox-tips">
            <h3>Tips for Success</h3>
            {detoxPlan.tips.map((tip, i) => (
              <div key={i} className="detox-tip">
                <span className="tip-bullet">•</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECIPES */}
      {tab === 'recipes' && (
        <div className="recipes-content">
          <p className="recipes-intro">13 gluten-free, anti-bloat recipes to support your digestion.</p>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
            >
              <div className="recipe-header">
                <h3>{recipe.title}</h3>
                {recipe.prep_time_minutes && <span className="recipe-time">{recipe.prep_time_minutes} min</span>}
              </div>
              <p className="recipe-desc">{recipe.description}</p>

              {expandedRecipe === recipe.id && (
                <div className="recipe-detail">
                  <div className="recipe-section">
                    <h4>Ingredients</h4>
                    <ul>
                      {(recipe.ingredients || []).map((ing: string, i: number) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="recipe-section">
                    <h4>Steps</h4>
                    <ol>
                      {(recipe.steps || []).map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  {recipe.calories && <p className="recipe-cal">{recipe.calories} calories per serving</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
