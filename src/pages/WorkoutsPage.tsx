import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/common/PageHeader'
import './WorkoutsPage.css'

interface Workout {
  id: string
  title: string
  description: string
  duration_minutes: number
  difficulty: string
  body_focus: string
  video_url: string
  is_low_impact: boolean
}

const focusLabels: Record<string, string> = {
  full_body: 'Full Body',
  upper: 'Upper Body',
  lower: 'Lower Body',
  core: 'Core',
  stretch: 'Stretching',
}

const focusIcons: Record<string, string> = {
  full_body: '🏃‍♀️',
  upper: '💪',
  lower: '🦵',
  core: '🧘‍♀️',
  stretch: '🤸‍♀️',
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function WorkoutsPage() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadWorkouts()
  }, [user])

  async function loadWorkouts() {
    try {
      const resp = await fetch('/api/workouts')
      const data = resp.ok ? await resp.json() : []
      setWorkouts(data)
    } catch { setWorkouts([]) }

    if (user) {
      const { data: logs } = await supabase
        .from('workout_logs')
        .select('workout_id')
        .eq('user_id', user.id)
        .eq('date', today)
      if (logs) setCompletedIds(new Set(logs.map(l => l.workout_id)))
    }
    setLoading(false)
  }

  async function toggleComplete(workoutId: string) {
    if (!user) return
    if (completedIds.has(workoutId)) {
      await supabase.from('workout_logs')
        .delete()
        .eq('user_id', user.id)
        .eq('workout_id', workoutId)
        .eq('date', today)
      setCompletedIds(prev => { const n = new Set(prev); n.delete(workoutId); return n })
    } else {
      await supabase.from('workout_logs').insert({
        user_id: user.id,
        workout_id: workoutId,
        date: today,
      })
      setCompletedIds(prev => new Set(prev).add(workoutId))
    }
  }

  function handlePlay(workoutId: string) {
    setPlayingId(playingId === workoutId ? null : workoutId)
  }

  if (loading) return <div className="workouts-page"><p>Loading workouts...</p></div>

  return (
    <div className="workouts-page">
      <PageHeader title="Exercise Plan" color="#3a7a6a" />
      <p className="wo-subtitle">7–12 minute low-impact exercises. No jumping, safe for joints.</p>

      <div className="wo-stats">
        <div className="wo-stat">
          <span className="wo-stat-val">{completedIds.size}</span>
          <span className="wo-stat-label">done today</span>
        </div>
        <div className="wo-stat">
          <span className="wo-stat-val">{workouts.length}</span>
          <span className="wo-stat-label">total</span>
        </div>
      </div>

      <div className="wo-list">
        {workouts.map((wo) => {
          const done = completedIds.has(wo.id)
          const isPlaying = playingId === wo.id
          const ytId = getYouTubeId(wo.video_url)

          return (
            <div key={wo.id} className={`wo-card ${done ? 'completed' : ''}`}>
              <div className="wo-card-top">
                <div className="wo-card-info">
                  <span className="wo-focus-icon">{focusIcons[wo.body_focus] || '🏋️'}</span>
                  <div>
                    <h3>{wo.title}</h3>
                    <div className="wo-meta">
                      <span>{wo.duration_minutes} min</span>
                      <span className="wo-dot">·</span>
                      <span>{focusLabels[wo.body_focus] || wo.body_focus}</span>
                      <span className="wo-dot">·</span>
                      <span>{wo.difficulty}</span>
                    </div>
                  </div>
                </div>
                <button className={`wo-check ${done ? 'checked' : ''}`} onClick={() => toggleComplete(wo.id)}>
                  {done ? '✓' : ''}
                </button>
              </div>
              <p className="wo-desc">{wo.description}</p>

              {isPlaying && ytId ? (
                <div className="wo-video-container">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1&iv_load_policy=3`}
                    title={wo.title}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    className="wo-video-frame"
                  />
                  <button className="wo-close-video" onClick={() => setPlayingId(null)}>Close Video</button>
                </div>
              ) : (
                <button className="wo-video-btn" onClick={() => handlePlay(wo.id)}>
                  ▶ Watch Video
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
