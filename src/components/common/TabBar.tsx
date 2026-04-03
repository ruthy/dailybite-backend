import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './TabBar.css'

const tabs = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/meal-plan', label: 'Meals', icon: 'meals' },
  { path: '/scan', label: 'Scan', icon: 'scan' },
  { path: '/workouts', label: 'Workouts', icon: 'workouts' },
  { path: '/more', label: 'More', icon: 'more' },
]

const moreItems = [
  { path: '/water', label: 'Water Tracker', icon: '💧' },
  { path: '/gut-health', label: 'Gut Health', icon: '🌿' },
  { path: '/progress', label: 'Progress', icon: '📈' },
  { path: '/profile', label: 'Profile & Settings', icon: '👤' },
]

const icons: Record<string, (active: boolean) => React.ReactNode> = {
  home: (a) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? '#2d7a3a' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  meals: (a) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? '#2d7a3a' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  scan: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  ),
  workouts: (a) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? '#2d7a3a' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v16" /><path d="M18 4v16" /><path d="M2 8h4" /><path d="M2 16h4" /><path d="M18 8h4" /><path d="M18 16h4" /><path d="M6 12h12" />
    </svg>
  ),
  more: (a) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? '#2d7a3a' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1.5" fill={a ? '#2d7a3a' : '#9CA3AF'} /><circle cx="12" cy="12" r="1.5" fill={a ? '#2d7a3a' : '#9CA3AF'} /><circle cx="12" cy="19" r="1.5" fill={a ? '#2d7a3a' : '#9CA3AF'} />
    </svg>
  ),
}

export default function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)

  const morePaths = moreItems.map(m => m.path)
  const isMoreActive = morePaths.includes(location.pathname)

  return (
    <>
      {showMore && (
        <div className="more-overlay" onClick={() => setShowMore(false)}>
          <div className="more-menu" onClick={(e) => e.stopPropagation()}>
            {moreItems.map((item) => (
              <button
                key={item.path}
                className={`more-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => { navigate(item.path); setShowMore(false) }}
              >
                <span className="more-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <nav className="tab-bar">
        {tabs.map((tab) => {
          const isMore = tab.icon === 'more'
          const isScan = tab.icon === 'scan'
          const active = isMore ? isMoreActive : location.pathname === tab.path
          return (
            <button
              key={tab.path}
              className={`tab-item ${active ? 'active' : ''} ${isScan ? 'scan-tab' : ''}`}
              onClick={() => {
                if (isMore) { setShowMore(!showMore) }
                else { setShowMore(false); navigate(tab.path) }
              }}
            >
              <div className={isScan ? 'scan-icon-wrap' : 'tab-icon'}>
                {icons[tab.icon](active)}
              </div>
              {!isScan && <span className="tab-label">{tab.label}</span>}
            </button>
          )
        })}
      </nav>
    </>
  )
}
