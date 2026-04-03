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

    await supabase.from('profiles').update({ weight_kg: weight }).eq('id', user.id)
    await refreshProfile()

    setWeightInput('')
    loadWeightHistory()
  }

  async function handleDeleteAccount() {
    if (!user) return
    const { error } = await supabase.from('profiles').delete().eq('id', user.id)
    if (error) {
      alert('Failed to delete account. Please try again.')
      return
    }
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

      {/* Weight History */}
      {weightHistory.length > 0 && (
        <div className="profile-section">
          <h3>Recent Weights</h3>
          <div className="weight-list">
            {weightHistory.slice(0, 7).map((w) => (
              <div key={w.date} className="weight-row">
                <span>{new Date(w.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="weight-val">{w.weight_kg} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
