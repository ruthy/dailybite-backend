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
  const [openDetoxDay, setOpenDetoxDay] = useState<number | null>(null)
  const [logStatus, setLogStatus] = useState<string>('')
  const [history, setHistory] = useState<any[]>([])
  const [selectedCalDay, setSelectedCalDay] = useState<number | null>(null)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (user) { loadToday(); loadHistory() }
    loadRecipes()
  }, [user])

  async function loadToday() {
    if (!user?.email) return
    try {
      const resp = await fetch(`/api/bloating-log/${encodeURIComponent(user.email)}/${today}`)
      const data = resp.ok ? await resp.json() : null
      if (data) {
        setSeverity(data.severity)
        setTriggers(data.triggers || [])
        setNotes(data.notes || '')
        setTodayLogged(true)
      }
    } catch (err) {
      console.error('Failed to load today bloating log:', err)
    }
  }

  async function loadHistory() {
    if (!user?.email) return
    try {
      const resp = await fetch(`/api/bloating-history/${encodeURIComponent(user.email)}`)
      if (resp.ok) setHistory(await resp.json())
    } catch {}
  }

  async function loadRecipes() {
    try {
      const resp = await fetch('/api/recipes')
      const data = resp.ok ? await resp.json() : []
      setRecipes(data)
    } catch { setRecipes([]) }
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
    if (!user || !user.email) {
      setLogStatus('Error: Not signed in. Please sign in and try again.')
      return
    }
    if (severity === 0) {
      setLogStatus('Please select a bloating severity level first.')
      return
    }
    setLogStatus('Saving...')
    try {
      const resp = await fetch('/api/bloating-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, date: today, severity, triggers, notes }),
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Server error' }))
        setLogStatus(`Error: ${err.error || 'Failed to save'}`)
        return
      }
      setTodayLogged(true)
      setLogStatus('Saved successfully!')
      loadHistory()
      setTimeout(() => setLogStatus(''), 3000)
    } catch (err: any) {
      setLogStatus(`Error: Could not reach server. ${err?.message || ''}`)
    }
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
            {logStatus && (
              <p style={{
                marginTop: '10px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 500,
                color: logStatus.startsWith('Error') || logStatus.startsWith('Please') ? '#d32f2f' : logStatus === 'Saving...' ? '#888' : '#2e7d32',
              }}>
                {logStatus}
              </p>
            )}
          </div>

          {/* Bloating Calendar */}
          {history.length > 0 && (() => {
            const now = new Date()
            const month = now.getMonth()
            const year = now.getFullYear()
            const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
            const firstDay = new Date(year, month, 1).getDay()
            const daysInMonth = new Date(year, month + 1, 0).getDate()
            const todayDate = now.getDate()

            const logMap: Record<number, any> = {}
            history.forEach((log: any) => {
              const d = new Date(log.date + 'T00:00:00')
              if (d.getMonth() === month && d.getFullYear() === year) {
                logMap[d.getDate()] = log
              }
            })

            const faces = ['', '😊', '🙂', '😐', '😣', '😫']
            const selectedLog = selectedCalDay ? logMap[selectedCalDay] : null

            return (
              <div className="bloating-calendar">
                <h3>Bloating Calendar — {monthNames[month]} {year}</h3>
                <div className="bloating-cal-grid">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <span key={i} className="bloating-cal-weekday">{d}</span>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dateNum = i + 1
                    const log = logMap[dateNum]
                    const isToday = dateNum === todayDate
                    const isSelected = selectedCalDay === dateNum
                    return (
                      <div
                        key={dateNum}
                        className={`bloating-cal-cell ${log ? 'has-log' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => log && setSelectedCalDay(isSelected ? null : dateNum)}
                      >
                        <span className="bloating-cal-date">{dateNum}</span>
                        {log && <span className="bloating-cal-face">{faces[log.severity] || ''}</span>}
                      </div>
                    )
                  })}
                </div>

                {/* Selected day detail */}
                {selectedLog && (
                  <div className="bloating-cal-detail">
                    <div className="bloating-cal-detail-header">
                      <span className="bloating-cal-detail-face">{faces[selectedLog.severity]}</span>
                      <div>
                        <strong>{new Date(selectedLog.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
                        <span>Severity: {selectedLog.severity}/5</span>
                      </div>
                    </div>
                    {selectedLog.triggers && selectedLog.triggers.length > 0 && (
                      <div className="bloating-cal-detail-triggers">
                        {selectedLog.triggers.map((t: string, i: number) => (
                          <span key={i} className="bloating-cal-trigger-chip">{t}</span>
                        ))}
                      </div>
                    )}
                    {selectedLog.notes && (
                      <p className="bloating-cal-detail-notes">{selectedLog.notes}</p>
                    )}
                  </div>
                )}

                {/* Legend */}
                <div className="bloating-cal-legend">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="bloating-cal-legend-item">{faces[s]} {s}</span>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* 48-HOUR DETOX */}
      {tab === 'detox' && (
        <div className="detox-content">
          <div className="detox-header">
            <h2>{detoxPlan.title}</h2>
            <p>{detoxPlan.description}</p>
          </div>

          <div className="detox-day-buttons">
            {detoxPlan.days.map((day, di) => (
              <button
                key={di}
                className={`detox-day-btn ${openDetoxDay === di ? 'active' : ''}`}
                onClick={() => setOpenDetoxDay(openDetoxDay === di ? null : di)}
              >
                {day.label}
                <span className={`detox-day-arrow ${openDetoxDay === di ? 'open' : ''}`}>▶</span>
              </button>
            ))}
          </div>

          {openDetoxDay !== null && (
            <div className="detox-day-content">
              <div className="detox-items">
                {detoxPlan.days[openDetoxDay].items.map((item, ii) => {
                  const key = `${openDetoxDay}-${ii}`
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
          )}

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
