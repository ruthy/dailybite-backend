import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MetaBoost from '../components/MetaBoost'
import './HomePage.css'

const sections = [
  { id: 'progress', title: 'Progress Tracker', subtitle: 'Track your daily weight and streaks', path: '/progress', color: '#2d7a3a' },
  { id: 'scan', title: 'Scan My Plate', subtitle: 'Snap a photo, get instant calorie estimates', path: '/scan', color: '#3b6b8a', icon: '📸' },
  { id: 'calculator', title: 'Daily Calorie Calculator', subtitle: 'Calculate your personal daily calorie target', path: '/calculator', color: '#5a8a5e' },
  { id: 'mealplan', title: 'Weekly Meal Plan', subtitle: 'Gluten-free meals · Balanced macros · 7 days', path: '/meal-plan', color: '#e8ddd0', light: true },
  { id: 'metaboost', title: 'MetaBoost Morning Shots', subtitle: 'One shot every morning on empty stomach', path: '/metaboost', color: '#c47a4a' },
  { id: 'water', title: 'Water Tracker', subtitle: '8 glasses per day · Stay hydrated', path: '/water', color: '#4a8a8a' },
  { id: 'gut', title: 'Gut Health', subtitle: 'Bloating tracker · 48h detox · Anti-bloat recipes', path: '/gut-health', color: '#6a9a6a' },
  { id: 'rules', title: 'Key Rules', subtitle: '9 rules that make this plan work', path: '/rules', color: '#8a7a5a' },
  { id: 'sleep', title: 'Sleep & Recovery', subtitle: 'Sleep is when your body burns fat', path: '/sleep', color: '#5a6a7a' },
  { id: 'shopping', title: 'Weekly Shopping List', subtitle: 'Everything you need for the week', path: '/shopping', color: '#7a8a5a' },
  { id: 'steps', title: 'Steps Tracker', subtitle: 'Log daily steps · 8,000 goal · Calendar view', path: '/steps', color: '#3b6b8a' },
  { id: 'programs', title: '30 Days Exercise Programs', subtitle: 'Yoga · Fitness · Daily guided exercises', path: '/yoga', color: '#7a6a8a' },
]

export default function HomePage() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [reminders, setReminders] = useState(() => localStorage.getItem('dailybite-reminders') === 'on')

  function handleSection(id: string, path: string) {
    if (id === 'metaboost') {
      setExpandedId(expandedId === id ? null : id)
    } else {
      navigate(path)
    }
  }

  return (
    <div className="home-page">
      {/* Header */}
      <div className="app-header">
        <div className="app-header-left">
          <span className="app-logo-icon">🍎</span>
          <span className="app-logo-text">DailyBite</span>
        </div>
        <div className="app-header-right">
          <button className="header-signout-btn" onClick={signOut}>Sign Out</button>
          <button className="header-profile-btn" onClick={() => navigate('/profile')}>
            {profile?.name?.charAt(0).toUpperCase() || '?'}
          </button>
        </div>
      </div>

      {/* Calorie Target Center Strip */}
      {profile?.daily_calorie_target && (
        <div className="header-target-strip">
          <span className="header-target-num">{profile.daily_calorie_target}</span>
          <span className="header-target-label">cal/day</span>
        </div>
      )}

      {/* Welcome */}
      <div className="welcome-bar">
        <span>Welcome back, <strong>{profile?.name?.split(' ')[0] || 'there'}!</strong></span>
      </div>

      {/* Reminders Banner */}
      <div className={`reminder-banner ${reminders ? 'active' : ''}`}>
        <div className="reminder-info">
          <span className="reminder-text">{reminders ? 'Daily reminders are on' : 'Get daily reminders'}</span>
          {reminders && <span className="reminder-sub">Water · Meals · Workouts</span>}
        </div>
        <button
          className={`reminder-toggle ${reminders ? 'on' : ''}`}
          onClick={() => {
            const next = !reminders
            setReminders(next)
            localStorage.setItem('dailybite-reminders', next ? 'on' : 'off')
          }}
        >
          <span className="reminder-toggle-knob" />
        </button>
      </div>

      {/* Section Cards */}
      <div className="section-cards">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              className={`section-card ${section.light ? 'light' : ''} ${expandedId === section.id ? 'open' : ''}`}
              style={{ backgroundColor: section.color }}
              onClick={() => handleSection(section.id, section.path)}
            >
              <div className="section-card-text">
                <strong>{section.icon ? `${section.icon} ${section.title}` : section.title}</strong>
                <span>{section.subtitle}</span>
              </div>
              <div className={`section-arrow ${section.light ? 'light' : ''} ${expandedId === section.id ? 'open' : ''}`}>
                <span>▶</span>
              </div>
            </button>
            {section.id === 'metaboost' && expandedId === 'metaboost' && (
              <MetaBoost />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="app-footer">
        <p>&copy; 2026 DailyBite — The plan that transforms how you eat.</p>
      </div>
    </div>
  )
}
