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
    await supabase.from('profiles').update({ weight_kg: w }).eq('id', user.id)
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

      {/* Weight Chart */}
      <div className="prog-card">
        <h3>Weight History</h3>
        {weights.length > 1 ? (
          <>
            <div className="weight-chart">
              <div className="chart-labels">
                <span>{maxW}kg</span>
                <span>{minW}kg</span>
              </div>
              <div className="chart-bars">
                {weights.slice(-14).map((w, i) => (
                  <div key={i} className="chart-bar-wrap">
                    <div
                      className="chart-bar"
                      style={{ height: `${((w.weight_kg - minW) / range) * 100}%` }}
                    />
                    <span className="chart-date">
                      {new Date(w.date + 'T00:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {change !== null && (
              <p className="weight-change-text">
                {change > 0 ? `+${change}` : change}kg since you started
              </p>
            )}
          </>
        ) : (
          <p className="prog-empty">Log your weight regularly to see your chart here.</p>
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
