import { useState, useEffect, useRef } from 'react'
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

const goalOptions = [
  { value: 'lose', label: 'Lose Weight', desc: '1 kg / week' },
  { value: 'maintain', label: 'Maintain', desc: 'Stay the same' },
  { value: 'gain', label: 'Gain Weight', desc: 'Healthy gain' },
]

export default function CalcPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [age, setAge] = useState('')
  const [activity, setActivity] = useState('sedentary')
  const [goal, setGoal] = useState('lose')
  const [savedTarget, setSavedTarget] = useState<number | null>(null)
  const [btnText, setBtnText] = useState('Save as My Target')
  const [btnClass, setBtnClass] = useState('')
  const didLoad = useRef(false)

  useEffect(() => {
    if (profile && !didLoad.current) {
      didLoad.current = true
      if (profile.height_cm) setHeightCm(String(profile.height_cm))
      if (profile.weight_kg) setWeightKg(String(profile.weight_kg))
      if (profile.activity_level) setActivity(profile.activity_level)
      if (profile.goal) setGoal(profile.goal)
      if (profile.daily_calorie_target) setSavedTarget(profile.daily_calorie_target)
      if (profile.date_of_birth) {
        const birth = new Date(profile.date_of_birth)
        if (!isNaN(birth.getTime())) {
          const today = new Date()
          let a = today.getFullYear() - birth.getFullYear()
          const m = today.getMonth() - birth.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--
          setAge(String(a))
        }
      }
    }
  }, [profile])

  // Calculate
  const w = parseFloat(weightKg)
  const h = parseFloat(heightCm)
  const a = parseInt(age)
  let result: number | null = null
  if (w > 0 && h > 0 && a > 0) {
    const bmr = (10 * w) + (6.25 * h) - (5 * a) - 161
    const mult = activityLevels.find(l => l.value === activity)?.multiplier || 1.2
    const tdee = bmr * mult
    let target = tdee
    if (goal === 'lose') target = tdee * 0.62
    else if (goal === 'gain') target = tdee + 300
    result = Math.max(1000, Math.round(target))
  }

  // Reset button when inputs change
  useEffect(() => {
    setBtnText('Save as My Target')
    setBtnClass('')
  }, [weightKg, heightCm, age, activity, goal])

  async function handleSave() {
    if (!user || !result) return

    setBtnText('Saving...')
    setBtnClass('saving')

    try {
      const resp = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          daily_calorie_target: result,
          height_cm: parseFloat(heightCm),
          weight_kg: parseFloat(weightKg),
          activity_level: activity,
          goal,
        }),
      })

      const data = await resp.json()

      if (!resp.ok) {
        setBtnText('Error: ' + (data.error || 'Save failed'))
        setBtnClass('error')
        return
      }

      setSavedTarget(result)
      setBtnText(`✓ Saved ${result} cal → Dashboard & Meal Plan`)
      setBtnClass('saved')
      refreshProfile().catch(() => {})

    } catch (err: any) {
      setBtnText('Network error — check connection')
      setBtnClass('error')
    }
  }

  return (
    <div className="calc-page">
      <PageHeader title="Daily Calorie Calculator" color="#2d6b3a" />
      <div className="calc-content">
        {/* Show saved target if exists */}
        {savedTarget && (
          <div className="calc-saved-banner">
            Your saved target: <strong>{savedTarget} cal/day</strong>
          </div>
        )}

        <div className="calc-card">
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
                <button key={l.value} type="button"
                  className={`calc-option ${activity === l.value ? 'active' : ''}`}
                  onClick={() => setActivity(l.value)}>
                  <strong>{l.label}</strong>
                  <span>{l.desc}</span>
                </button>
              ))}
            </div>

            <label className="calc-section-label">Your Goal</label>
            <div className="calc-goals">
              {goalOptions.map(g => (
                <button key={g.value} type="button"
                  className={`calc-goal ${goal === g.value ? 'active' : ''}`}
                  onClick={() => setGoal(g.value)}>
                  <strong>{g.label}</strong>
                  <span className="calc-goal-desc">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className="calc-inline-result">
              <span className="calc-inline-num">{result}</span>
              <span className="calc-inline-label">calories / day</span>
            </div>
          )}

          {result && (
            <button type="button" className={`calc-save-btn ${btnClass}`}
              onClick={handleSave}
              disabled={btnClass === 'saving' || btnClass === 'saved'}>
              {btnText}
            </button>
          )}

          <p className="calc-disclaimer">Based on Mifflin-St Jeor equation. Consult a healthcare provider for personalized advice.</p>
        </div>
      </div>
    </div>
  )
}
