import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/common/PageHeader'
import './CalcPage.css'

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', multiplier: 1.2 },
  { value: 'light', label: 'Light', desc: 'Exercise 1–3 days/week', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate', desc: 'Exercise 3–5 days/week', multiplier: 1.55 },
  { value: 'active', label: 'Active', desc: 'Exercise 6–7 days/week', multiplier: 1.725 },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise daily', multiplier: 1.9 },
]

const goals = [
  { value: 'lose', label: 'Lose Weight', adjustment: -500 },
  { value: 'maintain', label: 'Maintain', adjustment: 0 },
  { value: 'gain', label: 'Gain Weight', adjustment: 250 },
]

export default function CalcPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [age, setAge] = useState('')
  const [activity, setActivity] = useState('sedentary')
  const [goal, setGoal] = useState('lose')
  const [result, setResult] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      if (profile.height_cm) setHeightCm(String(profile.height_cm))
      if (profile.weight_kg) setWeightKg(String(profile.weight_kg))
      if (profile.activity_level) setActivity(profile.activity_level)
      if (profile.goal) setGoal(profile.goal)
      if (profile.date_of_birth) {
        const today = new Date()
        const birth = new Date(profile.date_of_birth)
        let a = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--
        setAge(String(a))
      }
      if (profile.daily_calorie_target) setResult(profile.daily_calorie_target)
    }
  }, [profile])

  function calculate() {
    const w = parseFloat(weightKg)
    const h = parseFloat(heightCm)
    const a = parseInt(age)
    if (!w || !h || !a) return

    const bmr = (10 * w) + (6.25 * h) - (5 * a) - 161
    const mult = activityLevels.find(l => l.value === activity)?.multiplier || 1.2
    const adj = goals.find(g => g.value === goal)?.adjustment || 0
    const target = Math.max(1200, Math.round(bmr * mult + adj))
    setResult(target)
    setSaved(false)
  }

  async function saveTarget() {
    if (!user || !result) return
    await supabase.from('profiles').update({
      daily_calorie_target: result,
      height_cm: parseFloat(heightCm),
      weight_kg: parseFloat(weightKg),
      activity_level: activity,
      goal,
    }).eq('id', user.id)
    await refreshProfile()
    setSaved(true)
  }

  return (
    <div className="calc-page">
      <PageHeader title="Daily Calorie Calculator" color="#2d6b3a" />

      <div className="calc-content">
        {/* Current target */}
        {profile?.daily_calorie_target && (
          <div className="calc-current">
            <span className="calc-current-label">Your current daily target</span>
            <span className="calc-current-val">{profile.daily_calorie_target} cal</span>
          </div>
        )}

        {/* Form */}
        <div className="calc-card">
          <h3>Calculate Your Target</h3>
          <p className="calc-info">Based on the Mifflin-St Jeor equation for women.</p>

          <div className="calc-fields">
            <div className="calc-row">
              <div className="calc-field">
                <label>Age</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="42" />
              </div>
              <div className="calc-field">
                <label>Height (cm)</label>
                <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} placeholder="165" />
              </div>
              <div className="calc-field">
                <label>Weight (kg)</label>
                <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} placeholder="70" />
              </div>
            </div>

            <label className="calc-section-label">Activity Level</label>
            <div className="calc-options">
              {activityLevels.map(l => (
                <button
                  key={l.value}
                  className={`calc-option ${activity === l.value ? 'active' : ''}`}
                  onClick={() => setActivity(l.value)}
                >
                  <strong>{l.label}</strong>
                  <span>{l.desc}</span>
                </button>
              ))}
            </div>

            <label className="calc-section-label">Your Goal</label>
            <div className="calc-goals">
              {goals.map(g => (
                <button
                  key={g.value}
                  className={`calc-goal ${goal === g.value ? 'active' : ''}`}
                  onClick={() => setGoal(g.value)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <button className="calc-btn" onClick={calculate} disabled={!age || !heightCm || !weightKg}>
            Calculate
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="calc-result">
            <div className="calc-result-box">
              <span className="calc-result-num">{result}</span>
              <span className="calc-result-unit">calories per day</span>
            </div>
            <p className="calc-disclaimer">This is an estimate. Consult a healthcare provider for personalized advice.</p>
            {saved ? (
              <button className="calc-save-btn saved" disabled>Saved!</button>
            ) : (
              <button className="calc-save-btn" onClick={saveTarget}>Save as My Target</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
