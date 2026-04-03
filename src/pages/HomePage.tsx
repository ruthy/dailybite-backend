import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './HomePage.css'

const sections = [
  { id: 'progress', title: 'Progress Tracker', subtitle: 'Track your daily weight and streaks', path: '/progress', color: '#2d6b3a' },
  { id: 'scan', title: 'Scan My Plate', subtitle: 'Snap a photo, get instant calorie estimates', path: '/scan', color: '#2c3e6b', icon: '📸' },
  { id: 'calculator', title: 'Daily Calorie Calculator', subtitle: 'Calculate your personal daily calorie target', path: '/calculator', color: '#2d6b3a' },
  { id: 'mealplan', title: 'Weekly Meal Plan', subtitle: 'Gluten-free meals · Balanced macros · 7 days', path: '/meal-plan', color: '#f8f8f6', light: true },
  { id: 'metaboost', title: 'MetaBoost Morning Shots', subtitle: 'One shot every morning on empty stomach', path: '/metaboost', color: '#8b5a3c' },
  { id: 'water', title: 'Water Tracker', subtitle: '8 glasses per day · Stay hydrated', path: '/water', color: '#3a7a6a' },
  { id: 'gut', title: 'Gut Health', subtitle: 'Bloating tracker · 48h detox · Anti-bloat recipes', path: '/gut-health', color: '#4a8a5a' },
  { id: 'rules', title: 'Key Rules', subtitle: '9 rules that make this plan work', path: '/rules', color: '#8b5a3c' },
  { id: 'sleep', title: 'Sleep & Recovery', subtitle: 'Sleep is when your body burns fat', path: '/sleep', color: '#2c3e5a' },
  { id: 'shopping', title: 'Weekly Shopping List', subtitle: 'Everything you need for the week', path: '/shopping', color: '#4a6a3a' },
  { id: 'exercise', title: 'Exercise Plan', subtitle: '7–12 min daily · Low impact · No jumping', path: '/workouts', color: '#3a7a6a' },
]

export default function HomePage() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="home-page">
      {/* Header */}
      <div className="app-header">
        <div className="app-header-left">
          <span className="app-logo-icon">🍎</span>
          <span className="app-logo-text">DailyBite</span>
        </div>
        <div className="app-header-right">
          <button className="header-profile-btn" onClick={() => navigate('/profile')}>
            {profile?.name?.charAt(0).toUpperCase() || '?'}
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div className="welcome-bar">
        <span>Welcome back, <strong>{profile?.name?.split(' ')[0] || 'there'}!</strong></span>
      </div>

      {/* Reminders Banner */}
      <div className="reminder-banner">
        <span>Get daily reminders</span>
        <button className="reminder-btn">Turn on</button>
      </div>

      {/* Section Cards */}
      <div className="section-cards">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`section-card ${section.light ? 'light' : ''}`}
            style={{ backgroundColor: section.color }}
            onClick={() => navigate(section.path)}
          >
            <div className="section-card-text">
              <strong>{section.icon ? `${section.icon} ${section.title}` : section.title}</strong>
              <span>{section.subtitle}</span>
            </div>
            <div className={`section-play ${section.light ? 'light' : ''}`}>
              <span>▶</span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="app-footer">
        <p>&copy; 2026 DailyBite — The plan that transforms how you eat.</p>
      </div>
    </div>
  )
}
