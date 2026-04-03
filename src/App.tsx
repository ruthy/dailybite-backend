import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import MealPlanPage from './pages/MealPlanPage'
import ScanPage from './pages/ScanPage'
import GutHealthPage from './pages/GutHealthPage'
import ProfilePage from './pages/ProfilePage'
import WaterPage from './pages/WaterPage'
import WorkoutsPage from './pages/WorkoutsPage'
import ProgressPage from './pages/ProgressPage'
import ContentPage from './pages/ContentPage'
import CalcPage from './pages/CalcPage'
import './App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/welcome" replace />
  return <>{children}</>
}

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user && (!profile || !profile.onboarding_completed)) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-logo">DailyBite.fit</div>
      <div className="loading-spinner" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          <AuthRedirect>
            <LandingPage />
          </AuthRedirect>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <OnboardingGate>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/meal-plan" element={<MealPlanPage />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/workouts" element={<WorkoutsPage />} />
                <Route path="/water" element={<WaterPage />} />
                <Route path="/gut-health" element={<GutHealthPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/calculator" element={<CalcPage />} />
                <Route path="/metaboost" element={<ContentPage />} />
                <Route path="/rules" element={<ContentPage />} />
                <Route path="/sleep" element={<ContentPage />} />
                <Route path="/shopping" element={<ContentPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </OnboardingGate>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
