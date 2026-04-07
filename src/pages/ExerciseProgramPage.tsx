import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import { yogaDays, fitnessDays } from '../data/exerciseData'
import './ExerciseProgramPage.css'

export default function ExerciseProgramPage() {
  const [openProgram, setOpenProgram] = useState<'yoga' | 'fitness' | null>(null)
  const [openDay, setOpenDay] = useState<number | null>(1)
  const [openExercise, setOpenExercise] = useState<number | null>(null)

  const days = openProgram === 'yoga' ? yogaDays : openProgram === 'fitness' ? fitnessDays : []

  function toggleProgram(p: 'yoga' | 'fitness') {
    if (openProgram === p) {
      setOpenProgram(null)
    } else {
      setOpenProgram(p)
      setOpenDay(1)
      setOpenExercise(null)
    }
  }

  return (
    <div className="exercise-program-page">
      <PageHeader title="Exercise Programs" color="#3a7a6a" />
      <div className="ep-sections">

        {/* YOGA */}
        {openProgram !== 'fitness' && (
          <div className="ep-section">
            <button
              className={`ep-section-btn ${openProgram === 'yoga' ? 'open' : ''}`}
              style={{ backgroundColor: '#6a5a8b' }}
              onClick={() => toggleProgram('yoga')}
            >
              <span className="ep-section-icon">🧘‍♀️</span>
              <strong>30 Days Yoga</strong>
              <span className="ep-section-sub">Flexibility & calm</span>
              <span className={`ep-section-arrow ${openProgram === 'yoga' ? 'open' : ''}`}>▶</span>
            </button>
          </div>
        )}

        {/* FITNESS */}
        {openProgram !== 'yoga' && (
          <div className="ep-section">
            <button
              className={`ep-section-btn ${openProgram === 'fitness' ? 'open' : ''}`}
              style={{ backgroundColor: '#8b3a3a' }}
              onClick={() => toggleProgram('fitness')}
            >
              <span className="ep-section-icon">💪</span>
              <strong>30 Days Fitness</strong>
              <span className="ep-section-sub">Strength & endurance</span>
              <span className={`ep-section-arrow ${openProgram === 'fitness' ? 'open' : ''}`}>▶</span>
            </button>
          </div>
        )}

        {/* CALENDAR + EXERCISES (below whichever is open) */}
        {openProgram && (
          <div className="ep-content">
            <div className="ep-compact-cal">
              {Array.from({ length: 30 }).map((_, i) => (
                <button
                  key={i}
                  className={`ep-compact-day ${openDay === i + 1 ? 'selected' : ''}`}
                  onClick={() => { setOpenDay(i + 1); setOpenExercise(null) }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {openDay && days.find(d => d.day === openDay) && (
              <div className="ep-day-detail" style={{ backgroundColor: openProgram === 'yoga' ? '#6a5a8b' : '#8b3a3a' }}>
                <span className="ep-day-detail-label">Day {openDay}</span>
                <h3 className="ep-day-detail-title">{days.find(d => d.day === openDay)?.title}</h3>
                {days.find(d => d.day === openDay)?.exercises.map((ex: any, i: number) => (
                  <div key={i} className={`ep-ex ${openExercise === i ? 'open' : ''}`}
                    onClick={() => setOpenExercise(openExercise === i ? null : i)}>
                    <div className="ep-ex-row">
                      <span className="ep-ex-dot" />
                      <span className="ep-ex-name">{ex.name}</span>
                      <span className={`ep-ex-arrow ${openExercise === i ? 'open' : ''}`}>▶</span>
                    </div>
                    {openExercise === i && (
                      <p className="ep-ex-how">{ex.how}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
