import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/common/PageHeader'
import './WaterPage.css'

export default function WaterPage() {
  const { user } = useAuth()
  const [glasses, setGlasses] = useState(0)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (user) loadToday()
  }, [user])

  async function loadToday() {
    const { data } = await supabase
      .from('water_logs')
      .select('glasses')
      .eq('user_id', user!.id)
      .eq('date', today)
      .single()
    if (data) setGlasses(data.glasses)
  }

  async function toggleGlass(index: number) {
    if (!user) return
    const tapping = index + 1
    const newCount = tapping === glasses ? tapping - 1 : tapping
    setGlasses(newCount)
    await supabase.from('water_logs').upsert({
      user_id: user.id,
      date: today,
      glasses: newCount,
    }, { onConflict: 'user_id,date' })
  }

  const percent = Math.min(100, (glasses / 8) * 100)

  return (
    <div className="water-page">
      <PageHeader title="Water Tracker" color="#3a7a6a" />
      <p className="water-subtitle">Stay hydrated — tap a glass to log your water intake.</p>

      <div className="water-progress-ring">
        <svg viewBox="0 0 120 120" className="ring-svg">
          <circle cx="60" cy="60" r="52" className="ring-bg" />
          <circle cx="60" cy="60" r="52" className="ring-fill" style={{ strokeDasharray: `${percent * 3.27} 327` }} />
        </svg>
        <div className="ring-text">
          <span className="ring-count">{glasses}</span>
          <span className="ring-label">of 8</span>
        </div>
      </div>

      <div className="glasses-grid">
        {[0,1,2,3,4,5,6,7].map((i) => (
          <button
            key={i}
            className={`glass-btn ${i < glasses ? 'filled' : ''}`}
            onClick={() => toggleGlass(i)}
          >
            <span className="glass-icon">{i < glasses ? '💧' : '🥛'}</span>
            <span className="glass-num">{i + 1}</span>
          </button>
        ))}
      </div>

      {glasses >= 8 && (
        <div className="water-complete">
          Great job! You've reached your daily water goal! 🎉
        </div>
      )}

      <div className="water-tips">
        <h3>Hydration Tips</h3>
        <div className="tip-card">
          <span className="tip-icon">⏰</span>
          <p>Drink a glass of water first thing in the morning to kickstart your metabolism.</p>
        </div>
        <div className="tip-card">
          <span className="tip-icon">🍋</span>
          <p>Add lemon or cucumber slices for natural flavor without calories.</p>
        </div>
        <div className="tip-card">
          <span className="tip-icon">📱</span>
          <p>Set reminders every 2 hours to stay on track throughout the day.</p>
        </div>
      </div>
    </div>
  )
}
