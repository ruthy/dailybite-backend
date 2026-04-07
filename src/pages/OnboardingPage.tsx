import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import './OnboardingPage.css'

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
  { value: 'active', label: 'Active', desc: 'Exercise 6-7 days/week' },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise daily' },
]

const goals = [
  { value: 'lose', label: 'Lose Weight', icon: '📉' },
  { value: 'maintain', label: 'Maintain', icon: '⚖️' },
  { value: 'gain', label: 'Gain Weight', icon: '📈' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [dob, setDob] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [activity, setActivity] = useState('')
  const [goal, setGoal] = useState('')
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const hasFinished = useRef(false)

  // Navigate only after React has processed the profile state update
  useEffect(() => {
    if (hasFinished.current && profile?.onboarding_completed) {
      navigate('/', { replace: true })
    }
  }, [profile, navigate])

  function calculateAge(dateOfBirth: string): number {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    if (isNaN(birth.getTime())) return 0
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return Math.max(0, age)
  }

  function calculateCalories(): number {
    const weight = parseFloat(weightKg)
    const height = parseFloat(heightCm)
    const age = calculateAge(dob)
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
    const multipliers: Record<string, number> = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
    }
    const tdee = bmr * (multipliers[activity] || 1.2)
    let target = tdee
    if (goal === 'lose') target = tdee * 0.62
    else if (goal === 'gain') target = tdee + 300
    return Math.max(1000, Math.round(target))
  }

  async function handleFinish() {
    if (!user) {
      setErrorMsg('Not logged in. Please sign in again.')
      return
    }
    setSaving(true)
    setErrorMsg('')

    try {
      const target = calculateCalories()

      const resp = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          date_of_birth: dob,
          height_cm: parseFloat(heightCm),
          weight_kg: parseFloat(weightKg),
          activity_level: activity,
          goal,
          daily_calorie_target: target,
          onboarding_completed: true,
        }),
      })

      const result = await resp.json()
      if (!resp.ok) {
        setErrorMsg('Save failed: ' + (result.error || 'Please try again'))
        setSaving(false)
        return
      }

      // Log initial weight (non-blocking)
      supabase.from('weight_logs').upsert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        weight_kg: parseFloat(weightKg),
      }, { onConflict: 'user_id,date' })

      hasFinished.current = true
      await refreshProfile()
    } catch (err: any) {
      setErrorMsg('Error: ' + (err?.message || 'Please try again'))
    } finally {
      setSaving(false)
    }
  }

  const screens = [
    // Step 0: Welcome
    <div className="ob-step" key="welcome">
      <div className="ob-emoji">🌿</div>
      <h1>Welcome to DailyBite.fit</h1>
      <p>Your AI-powered nutrition companion. Scan your plate, track your meals, and get personalized guidance — one bite at a time.</p>
      <button className="ob-button" onClick={() => setStep(1)}>Let's Get Started</button>
    </div>,

    // Step 1: Body info
    <div className="ob-step" key="body">
      <div className="ob-emoji">📋</div>
      <h2>About You</h2>
      <p>This helps us calculate your personal calorie target.</p>
      <div className="ob-fields">
        <div className="input-group">
          <label>Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="ob-row">
          <div className="input-group">
            <label>Height (cm)</label>
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="165" />
          </div>
          <div className="input-group">
            <label>Weight (kg)</label>
            <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="70" />
          </div>
        </div>
      </div>
      <button
        className="ob-button"
        disabled={!dob || !heightCm || !weightKg}
        onClick={() => setStep(2)}
      >
        Continue
      </button>
    </div>,

    // Step 2: Activity level
    <div className="ob-step" key="activity">
      <div className="ob-emoji">🏃‍♀️</div>
      <h2>Activity Level</h2>
      <p>How active are you on a typical week?</p>
      <div className="ob-options">
        {activityLevels.map((level) => (
          <button
            key={level.value}
            className={`ob-option ${activity === level.value ? 'selected' : ''}`}
            onClick={() => setActivity(level.value)}
          >
            <strong>{level.label}</strong>
            <span>{level.desc}</span>
          </button>
        ))}
      </div>
      <button className="ob-button" disabled={!activity} onClick={() => setStep(3)}>
        Continue
      </button>
    </div>,

    // Step 3: Goal
    <div className="ob-step" key="goal">
      <div className="ob-emoji">🎯</div>
      <h2>Your Goal</h2>
      <p>What would you like to achieve?</p>
      <div className="ob-goals">
        {goals.map((g) => (
          <button
            key={g.value}
            className={`ob-goal ${goal === g.value ? 'selected' : ''}`}
            onClick={() => setGoal(g.value)}
          >
            <span className="ob-goal-icon">{g.icon}</span>
            <span>{g.label}</span>
          </button>
        ))}
      </div>
      <button className="ob-button" disabled={!goal} onClick={() => setStep(4)}>
        Continue
      </button>
    </div>,

    // Step 4: Result
    <div className="ob-step" key="result">
      <div className="ob-emoji">✨</div>
      <h2>Your Daily Target</h2>
      <div className="ob-target">
        <span className="ob-target-number">{dob && heightCm && weightKg && activity && goal ? calculateCalories() : '—'}</span>
        <span className="ob-target-unit">calories / day</span>
      </div>
      <p className="ob-disclaimer">This is an estimate based on the Mifflin-St Jeor equation. Consult a healthcare provider for personalized advice.</p>
      {errorMsg && <p style={{ color: 'red', fontSize: 14, textAlign: 'center' }}>{errorMsg}</p>}
      <button className="ob-button" onClick={handleFinish} disabled={saving}>
        {saving ? 'Saving...' : 'Start My Plan'}
      </button>
    </div>,
  ]

  return (
    <div className="onboarding-page">
      <div className="ob-progress">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className={`ob-dot ${i <= step ? 'active' : ''}`} />
        ))}
      </div>
      {screens[step]}
    </div>
  )
}
