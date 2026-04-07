import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/common/PageHeader'
import './ProgressPage.css'

interface WeightEntry {
  date: string
  weight_kg: number
}

export default function ProgressPage() {
  const { user, profile } = useAuth()
  const [weights, setWeights] = useState<WeightEntry[]>([])
  const [streak, setStreak] = useState(0)
  const [totalMeals, setTotalMeals] = useState(0)
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [totalWaterDays, setTotalWaterDays] = useState(0)
  const [weightInput, setWeightInput] = useState('')

  useEffect(() => {
    if (user) loadAll()
  }, [user])

  async function loadAll() {
    if (!user) return

    const [wRes, mRes, woRes, waRes] = await Promise.all([
      supabase.from('weight_logs').select('date, weight_kg').eq('user_id', user.id).order('date', { ascending: true }).limit(60),
      supabase.from('meal_logs').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('workout_logs').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('water_logs').select('id').eq('user_id', user.id).gte('glasses', 8),
    ])

    setWeights(wRes.data || [])
    setTotalMeals(mRes.count || 0)
    setTotalWorkouts(woRes.count || 0)
    setTotalWaterDays(waRes.data?.length || 0)

    // Calculate streak from recent activity (meals, water, workouts)
    const { data: recentWater } = await supabase.from('water_logs')
      .select('date').eq('user_id', user.id).order('date', { ascending: false }).limit(60)
    const { data: recentMeals } = await supabase.from('meal_logs')
      .select('date').eq('user_id', user.id).order('date', { ascending: false }).limit(60)
    const { data: recentWorkouts } = await supabase.from('workout_logs')
      .select('date').eq('user_id', user.id).order('date', { ascending: false }).limit(60)

    const activeDates = new Set<string>()
    recentWater?.forEach(r => activeDates.add(r.date))
    recentMeals?.forEach(r => activeDates.add(r.date))
    recentWorkouts?.forEach(r => activeDates.add(r.date))

    let s = 0
    let d = new Date()
    for (let i = 0; i < 365; i++) {
      const ds = d.toISOString().split('T')[0]
      if (!activeDates.has(ds)) break
      s++
      d.setDate(d.getDate() - 1)
    }
    setStreak(s)
  }

  async function logWeight() {
    if (!user || !weightInput) return
    const w = parseFloat(weightInput)
    if (isNaN(w) || w < 20 || w > 300) return
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('weight_logs').upsert({ user_id: user.id, date: today, weight_kg: w }, { onConflict: 'user_id,date' })
    if (user) {
      await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, weight_kg: w }),
      })
    }
    setWeightInput('')
    loadAll()
  }

  const latestW = weights.length > 0 ? weights[weights.length - 1].weight_kg : null
  const firstW = weights.length > 1 ? weights[0].weight_kg : null
  const change = latestW && firstW ? +(latestW - firstW).toFixed(1) : null
  const maxW = weights.length > 0 ? Math.max(...weights.map(w => w.weight_kg)) : 100
  const minW = weights.length > 0 ? Math.min(...weights.map(w => w.weight_kg)) : 50
  const range = maxW - minW || 1

  return (
    <div className="progress-page">
      <PageHeader title="Progress Tracker" color="#2d5a3a" />
      <p className="prog-subtitle">Track your journey — see how far you've come.</p>

      {/* Stats */}
      <div className="prog-stats">
        <div className="prog-stat">
          <span className="prog-stat-icon">🔥</span>
          <span className="prog-stat-val">{streak}</span>
          <span className="prog-stat-label">day streak</span>
        </div>
        <div className="prog-stat">
          <span className="prog-stat-icon">🍽️</span>
          <span className="prog-stat-val">{totalMeals}</span>
          <span className="prog-stat-label">meals logged</span>
        </div>
        <div className="prog-stat">
          <span className="prog-stat-icon">🏋️</span>
          <span className="prog-stat-val">{totalWorkouts}</span>
          <span className="prog-stat-label">workouts</span>
        </div>
        <div className="prog-stat">
          <span className="prog-stat-icon">💧</span>
          <span className="prog-stat-val">{totalWaterDays}</span>
          <span className="prog-stat-label">hydrated days</span>
        </div>
      </div>

      {/* Weight Graph */}
      <div className="prog-card">
        <h3>Weight Progress</h3>
        {weights.length > 1 ? (() => {
          const sorted = weights.slice(-14)
          const padding = range * 0.1
          return (
            <>
              <div className="prog-graph">
                <div className="prog-graph-labels">
                  <span>{(maxW + padding).toFixed(0)}kg</span>
                  <span>{(minW - padding > 0 ? minW - padding : minW).toFixed(0)}kg</span>
                </div>
                <div className="prog-graph-area">
                  <svg viewBox={`0 0 ${sorted.length * 40} 120`} className="prog-svg" preserveAspectRatio="none">
                    <line x1="0" y1="30" x2={sorted.length * 40} y2="30" stroke="#e0e0e0" strokeWidth="0.5" />
                    <line x1="0" y1="60" x2={sorted.length * 40} y2="60" stroke="#e0e0e0" strokeWidth="0.5" />
                    <line x1="0" y1="90" x2={sorted.length * 40} y2="90" stroke="#e0e0e0" strokeWidth="0.5" />
                    <path
                      d={`M ${sorted.map((w, i) => `${i * 40 + 20},${110 - ((w.weight_kg - minW + padding) / (range + padding * 2)) * 100}`).join(' L ')} L ${(sorted.length - 1) * 40 + 20},110 L 20,110 Z`}
                      fill="rgba(45,122,58,0.1)"
                    />
                    <polyline
                      points={sorted.map((w, i) => `${i * 40 + 20},${110 - ((w.weight_kg - minW + padding) / (range + padding * 2)) * 100}`).join(' ')}
                      fill="none" stroke="#2d7a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    />
                    {sorted.map((w, i) => (
                      <g key={i}>
                        <circle
                          cx={i * 40 + 20}
                          cy={110 - ((w.weight_kg - minW + padding) / (range + padding * 2)) * 100}
                          r="4" fill="#2d7a3a" stroke="#fff" strokeWidth="2"
                        />
                        <text
                          x={i * 40 + 20}
                          y={110 - ((w.weight_kg - minW + padding) / (range + padding * 2)) * 100 - 10}
                          textAnchor="middle" fontSize="8" fill="#2d7a3a" fontWeight="700"
                        >{w.weight_kg}</text>
                      </g>
                    ))}
                  </svg>
                  <div className="prog-graph-dates">
                    {sorted.map((w, i) => (
                      <span key={i}>{new Date(w.date + 'T00:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short' })}</span>
                    ))}
                  </div>
                </div>
              </div>
              {change !== null && (
                <div className="prog-change">
                  <span className={change <= 0 ? 'prog-loss' : 'prog-gain'}>
                    {change <= 0 ? '↓' : '↑'} {Math.abs(change)}kg
                  </span>
                  <span className="prog-since">since you started</span>
                </div>
              )}
            </>
          )
        })() : (
          <p className="prog-empty">Log your weight regularly to see your graph here.</p>
        )}
      </div>

      {/* Log Weight */}
      <div className="prog-card">
        <h3>Log Today's Weight</h3>
        <div className="weight-input-row">
          <input
            type="number"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="e.g. 68.5"
            step="0.1"
          />
          <button className="weight-log-btn" onClick={logWeight}>Log</button>
        </div>
        {latestW && <p className="current-weight">Current: {latestW}kg</p>}
      </div>
    </div>
  )
}
