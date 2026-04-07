import { useNavigate } from 'react-router-dom'
import './PageHeader.css'

interface Props {
  title: string
  color?: string
}

export default function PageHeader({ title, color }: Props) {
  const navigate = useNavigate()

  return (
    <div className="page-header" style={color ? { background: color } : undefined}>
      <h1 className="page-header-title">{title}</h1>
      <button className="page-close-arrow" onClick={() => navigate('/')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  )
}
