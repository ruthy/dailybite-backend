import { useState } from 'react'
import './ExerciseInline.css'

// Import the data from the page
import { yogaDays, fitnessDays } from '../data/exerciseData'

export default function ExerciseInline() {
  const [program, setProgram] = useState<'yoga' | 'fitness' | null>(null)
  const [openDay, setOpenDay] = useState<number | null>(1)
  const [openExercise, setOpenExercise] = useState<number | null>(null)

  const days = program === 'yoga' ? yogaDays : program === 'fitness' ? fitnessDays : []

  return (
    <div className="ex-inline">
      {/* Program choice */}
      {!program && (
        <div className="ex-choose">
          <button className="ex-program-btn yoga" onClick={() => setProgram('yoga')}>
            <span className="ex-program-icon">🧘‍♀️</span>
            <strong>30 Days Yoga</strong>
            <span>Flexibility & calm</span>
          </button>
          <button className="ex-program-btn fitness" onClick={() => setProgram('fitness')}>
            <span className="ex-program-icon">💪</span>
            <strong>30 Days Fitness</strong>
            <span>Strength & endurance</span>
          </button>
        </div>
      )}

      {/* Calendar + exercises */}
      {program && (
        <>
          <button className="ex-back" onClick={() => { setProgram(null); setOpenDay(1); setOpenExercise(null) }}>
            ← Back to programs
          </button>

          <div className="ex-cal-grid">
            {Array.from({ length: 30 }).map((_, i) => (
              <button
                key={i}
                className={`ex-cal-day ${openDay === i + 1 ? 'selected' : ''}`}
                onClick={() => { setOpenDay(i + 1); setOpenExercise(null) }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {openDay && days.find(d => d.day === openDay) && (
            <div className="ex-day-card">
              <div className="ex-day-header">
                <span className="ex-day-label">Day {openDay}</span>
                <h3>{days.find(d => d.day === openDay)?.title}</h3>
              </div>
              {days.find(d => d.day === openDay)?.exercises.map((ex, i) => (
                <div key={i} className={`ex-item ${openExercise === i ? 'open' : ''}`}
                  onClick={() => setOpenExercise(openExercise === i ? null : i)}>
                  <div className="ex-item-row">
                    <span className="ex-item-dot" />
                    <span className="ex-item-name">{ex.name}</span>
                    <span className={`ex-item-arrow ${openExercise === i ? 'open' : ''}`}>▶</span>
                  </div>
                  {openExercise === i && (
                    <p className="ex-item-how">{ex.how}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
