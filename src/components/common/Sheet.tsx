import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import './Sheet.css'

export default function Sheet({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Slide in on mount
    requestAnimationFrame(() => setVisible(true))
  }, [location.pathname])

  function handleClose() {
    setVisible(false)
    setTimeout(() => navigate('/'), 250)
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) handleClose()
  }

  return (
    <div className={`sheet-overlay ${visible ? 'visible' : ''}`} onClick={handleOverlayClick}>
      <div className={`sheet-container ${visible ? 'visible' : ''}`}>
        {children}
      </div>
    </div>
  )
}
