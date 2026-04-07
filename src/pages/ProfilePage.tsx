import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/common/PageHeader'
import './ProfilePage.css'

export default function ProfilePage() {
  const { profile, user, signOut, refreshProfile } = useAuth()
  const [weightInput, setWeightInput] = useState('')
  const [weightHistory, setWeightHistory] = useState<Array<{ date: string; weight_kg: number }>>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (user) loadWeightHistory()
  }, [user])

  async function loadWeightHistory() {
    const { data } = await supabase
      .from('weight_logs')
      .select('date, weight_kg')
      .eq('user_id', user!.id)
      .order('date', { ascending: false })
      .limit(30)
    setWeightHistory(data || [])
  }

  async function logWeight() {
    if (!user || !weightInput) return
    const weight = parseFloat(weightInput)
    if (isNaN(weight) || weight < 20 || weight > 300) return

    const today = new Date().toISOString().split('T')[0]
    await supabase.from('weight_logs').upsert({
      user_id: user.id,
      date: today,
      weight_kg: weight,
    }, { onConflict: 'user_id,date' })

    await fetch('/api/save-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, weight_kg: weight }),
    })
    await refreshProfile()

    setWeightInput('')
    loadWeightHistory()
  }

  async function handleDeleteAccount() {
    if (!user) return
    try {
      await supabase.from('profiles').delete().eq('id', user.id)
    } catch {}
    await signOut()
  }

  const latestWeight = weightHistory.length > 0 ? weightHistory[0].weight_kg : profile?.weight_kg
  const earliestWeight = weightHistory.length > 1 ? weightHistory[weightHistory.length - 1].weight_kg : null
  const weightChange = latestWeight && earliestWeight ? +(latestWeight - earliestWeight).toFixed(1) : null

  return (
    <div className="profile-page">
      <PageHeader title="Profile & Settings" color="#2d7a3a" />

      {/* User Info */}
      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="profile-info">
          <h2>{profile?.name}</h2>
          <p>{profile?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat">
          <span className="ps-value">{profile?.daily_calorie_target || '—'}</span>
          <span className="ps-label">cal target</span>
        </div>
        <div className="profile-stat">
          <span className="ps-value">{latestWeight ? `${latestWeight}kg` : '—'}</span>
          <span className="ps-label">weight</span>
        </div>
        <div className="profile-stat">
          <span className="ps-value">{profile?.height_cm ? `${profile.height_cm}cm` : '—'}</span>
          <span className="ps-label">height</span>
        </div>
      </div>

      {/* Weight Log */}
      <div className="profile-section">
        <h3>Log Weight</h3>
        <div className="weight-input-row">
          <input
            type="number"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="e.g. 68.5"
            step="0.1"
          />
          <button className="weight-btn" onClick={logWeight}>Log</button>
        </div>
        {weightChange !== null && (
          <p className="weight-change">
            {weightChange > 0 ? `+${weightChange}` : weightChange}kg since first log
          </p>
        )}
      </div>

      {/* Weight Graph */}
      {weightHistory.length > 0 && (() => {
        const sorted = [...weightHistory].reverse().slice(-14)
        const weights = sorted.map(w => w.weight_kg)
        const maxW = Math.max(...weights)
        const minW = Math.min(...weights)
        const range = maxW - minW || 1
        const padding = range * 0.1

        return (
          <div className="profile-section">
            <h3>Weight Progress</h3>
            <div className="weight-graph">
              <div className="weight-graph-labels">
                <span>{maxW + padding > 0 ? (maxW + padding).toFixed(0) : maxW}kg</span>
                <span>{minW - padding > 0 ? (minW - padding).toFixed(0) : minW}kg</span>
              </div>
              <div className="weight-graph-area">
                <svg viewBox={`0 0 ${sorted.length * 40} 120`} className="weight-svg" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="30" x2={sorted.length * 40} y2="30" stroke="#e0e0e0" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2={sorted.length * 40} y2="60" stroke="#e0e0e0" strokeWidth="0.5" />
                  <line x1="0" y1="90" x2={sorted.length * 40} y2="90" stroke="#e0e0e0" strokeWidth="0.5" />

                  {/* Area fill */}
                  <path
                    d={`M ${sorted.map((w, i) => `${i * 40 + 20},${110 - ((w.weight_kg - minW + padding) / (range + padding * 2)) * 100}`).join(' L ')} L ${(sorted.length - 1) * 40 + 20},110 L 20,110 Z`}
                    fill="rgba(45,122,58,0.1)"
                  />

                  {/* Line */}
                  <polyline
                    points={sorted.map((w, i) => `${i * 40 + 20},${110 - ((w.weight_kg - minW + padding) / (range + padding * 2)) * 100}`).join(' ')}
                    fill="none"
                    stroke="#2d7a3a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots */}
                  {sorted.map((w, i) => (
                    <circle
                      key={i}
                      cx={i * 40 + 20}
                      cy={110 - ((w.weight_kg - minW + padding) / (range + padding * 2)) * 100}
                      r="4"
                      fill="#2d7a3a"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                <div className="weight-graph-dates">
                  {sorted.map((w, i) => (
                    <span key={i} className="weight-graph-date">
                      {new Date(w.date + 'T00:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {weightChange !== null && (
              <div className="weight-graph-summary">
                <span className={weightChange <= 0 ? 'loss' : 'gain'}>
                  {weightChange <= 0 ? '↓' : '↑'} {Math.abs(weightChange)}kg
                </span>
                <span className="weight-graph-period">since you started</span>
              </div>
            )}
          </div>
        )
      })()}

      {/* Actions */}
      <div className="profile-actions">
        <button className="action-link" onClick={signOut}>Sign Out</button>
        <button className="action-link danger" onClick={() => setShowDeleteConfirm(true)}>
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account?</h3>
            <p>This will permanently delete your account and all your data. This action cannot be undone.</p>
            <div className="delete-actions">
              <button className="delete-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="delete-confirm" onClick={handleDeleteAccount}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
