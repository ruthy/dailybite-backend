import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/common/PageHeader'
import './StepsPage.css'

const DAILY_GOAL = 8000

export default function StepsPage() {
  const { user } = useAuth()
  const [steps, setSteps] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [saveStatus, setSaveStatus] = useState('')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (user?.email) loadHistory()
  }, [user])

  async function loadHistory() {
    if (!user?.email) return
    try {
      const resp = await fetch(`/api/steps/${encodeURIComponent(user.email)}`)
      if (resp.ok) {
        const data = await resp.json()
        setHistory(data)
        const todayLog = data.find((d: any) => d.date === today)
        if (todayLog) setSteps(String(todayLog.steps))
      }
    } catch {}
  }

  async function saveSteps() {
    if (!user?.email || !steps) return
    setSaveStatus('Saving...')
    try {
      const resp = await fetch('/api/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, date: today, steps: parseInt(steps) || 0 }),
      })
      if (resp.ok) {
        setSaveStatus('Saved!')
        loadHistory()
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        setSaveStatus('Error saving')
      }
    } catch { setSaveStatus('Error saving') }
  }

  // Calendar
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDate = now.getDate()

  const logMap: Record<number, number> = {}
  history.forEach((log: any) => {
    const d = new Date(log.date + 'T00:00:00')
    if (d.getMonth() === month && d.getFullYear() === year) {
      logMap[d.getDate()] = log.steps
    }
  })

  const selectedLog = selectedDay ? logMap[selectedDay] : null
  const totalSteps = Object.values(logMap).reduce((a, b) => a + b, 0)
  const daysLogged = Object.keys(logMap).length
  const avgSteps = daysLogged > 0 ? Math.round(totalSteps / daysLogged) : 0

  return (
    <div className="steps-page">
      <PageHeader title="Steps Tracker" color="#3b6b8a" />

      {/* Today's input */}
      <div className="steps-today">
        <h3>Today's Steps</h3>
        <div className="steps-input-row">
          <input
            type="number"
            value={steps}
            onChange={e => setSteps(e.target.value)}
            placeholder="e.g. 6500"
          />
          <button className="steps-save-btn" onClick={saveSteps}>
            {saveStatus || 'Save'}
          </button>
        </div>
        {steps && parseInt(steps) > 0 && (
          <div className="steps-progress-bar">
            <div className="steps-progress-fill" style={{ width: `${Math.min(100, (parseInt(steps) / DAILY_GOAL) * 100)}%` }} />
          </div>
        )}
        {steps && parseInt(steps) > 0 && (
          <p className="steps-goal-text">
            {parseInt(steps) >= DAILY_GOAL
              ? `🎉 Goal reached! ${parseInt(steps).toLocaleString()} / ${DAILY_GOAL.toLocaleString()}`
              : `${parseInt(steps).toLocaleString()} / ${DAILY_GOAL.toLocaleString()} — ${(DAILY_GOAL - parseInt(steps)).toLocaleString()} to go`
            }
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="steps-stats">
        <div className="steps-stat">
          <span className="steps-stat-val">{totalSteps.toLocaleString()}</span>
          <span className="steps-stat-label">total this month</span>
        </div>
        <div className="steps-stat">
          <span className="steps-stat-val">{avgSteps.toLocaleString()}</span>
          <span className="steps-stat-label">daily average</span>
        </div>
        <div className="steps-stat">
          <span className="steps-stat-val">{daysLogged}</span>
          <span className="steps-stat-label">days logged</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="steps-calendar">
        <h3>{monthNames[month]} {year}</h3>
        <div className="steps-cal-grid">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <span key={i} className="steps-cal-weekday">{d}</span>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dateNum = i + 1
            const daySteps = logMap[dateNum]
            const hasLog = daySteps !== undefined
            const hitGoal = hasLog && daySteps >= DAILY_GOAL
            const isToday = dateNum === todayDate
            const isFuture = dateNum > todayDate
            const isSelected = selectedDay === dateNum
            return (
              <div
                key={dateNum}
                className={`steps-cal-cell ${hasLog ? 'logged' : ''} ${hitGoal ? 'goal' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isFuture ? 'future' : ''}`}
                onClick={() => !isFuture && setSelectedDay(isSelected ? null : dateNum)}
              >
                <span className="steps-cal-date">{dateNum}</span>
                {hasLog && <span className="steps-cal-icon">{hitGoal ? '🏆' : '👟'}</span>}
              </div>
            )
          })}
        </div>

        {selectedDay && selectedLog !== undefined && selectedLog !== null && (
          <div className="steps-cal-detail">
            <strong>{new Date(year, month, selectedDay).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
            <span className="steps-cal-detail-num">{selectedLog.toLocaleString()} steps</span>
            <span className={selectedLog >= DAILY_GOAL ? 'steps-goal-hit' : 'steps-goal-miss'}>
              {selectedLog >= DAILY_GOAL ? '🏆 Goal reached!' : `${(DAILY_GOAL - selectedLog).toLocaleString()} short of goal`}
            </span>
          </div>
        )}

        <div className="steps-cal-legend">
          <span>👟 Logged</span>
          <span>🏆 Goal ({DAILY_GOAL.toLocaleString()}+)</span>
        </div>
      </div>
    </div>
  )
}
