import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LandingPage.css'

export default function LandingPage() {
  const [tab, setTab] = useState<'signup' | 'signin'>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [loading, setLoading] = useState(false)
  const { signUp, signIn } = useAuth()
  const navigate = useNavigate()

  function showMessage(text: string, type: 'success' | 'error') {
    setMessage(text)
    setMessageType(type)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    if (password.length < 6) {
      showMessage('Password must be at least 6 characters.', 'error')
      setLoading(false)
      return
    }
    const result = await signUp(email, password, name)
    setLoading(false)
    if (result.error) {
      if (result.error === 'User already registered') {
        showMessage('An account with this email already exists. Try signing in instead.', 'error')
      } else {
        showMessage(result.error, 'error')
      }
    } else if (result.confirmationRequired) {
      showMessage('Account created! Please check your email to confirm your account, then sign in.', 'success')
    } else {
      showMessage('Account created! Welcome to DailyBite.fit', 'success')
      setTimeout(() => navigate('/onboarding', { replace: true }), 1000)
    }
  }

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      if (error === 'Invalid login credentials') {
        showMessage('Incorrect email or password. Please try again, or sign up if you don\'t have an account yet.', 'error')
      } else {
        showMessage(error, 'error')
      }
    } else {
      showMessage('Login successful! Redirecting...', 'success')
      setTimeout(() => navigate('/', { replace: true }), 500)
    }
  }

  function switchTab(t: 'signup' | 'signin') {
    setTab(t)
    setName('')
    setEmail('')
    setPassword('')
    setMessage('')
    setMessageType('')
  }

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <a href="#" className="landing-logo">DailyBite.fit</a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#learn-more">Learn More</a>
          <a href="#get-started" className="nav-btn">Sign Up</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div>
          <h1>Eat Smarter.<br /><span>Live Better.</span></h1>
          <p>DailyBite.fit is your AI-powered nutrition companion. Scan your plate, track your meals, and get personalized guidance — one bite at a time.</p>
          <a href="#learn-more" className="hero-btn">Learn More</a>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <h2>What You Get</h2>
        <p className="subtitle">Everything you need to take control of your nutrition and fitness journey.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">📸</div>
            <h3>Scan Your Plate</h3>
            <p>Snap a photo of your meal and our AI instantly identifies the food, estimates portions, and calculates the full nutritional breakdown.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🍎</div>
            <h3>Personalized Meal Plans</h3>
            <p>Get daily meal recommendations tailored to your dietary preferences, allergies, and fitness goals.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Nutrition Tracking</h3>
            <p>Log your meals and track calories, macros, and micronutrients with ease.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🏋️</div>
            <h3>Fitness Integration</h3>
            <p>Sync your workouts and activity to get nutrition advice that matches your energy output.</p>
          </div>
          <div className="feature-card">
            <div className="icon">💡</div>
            <h3>Daily Bites</h3>
            <p>Receive quick, science-backed health tips every day to keep you informed and motivated.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📈</div>
            <h3>Progress Reports</h3>
            <p>Track your journey with weekly and monthly reports that show how far you've come.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="learn-more" id="learn-more">
        <h2>How It Works</h2>
        <p className="subtitle">Getting started with DailyBite.fit is simple. Here's how it works.</p>
        <div className="learn-more-content">
          <div className="learn-item">
            <div className="number">1</div>
            <div>
              <h3>Create Your Account</h3>
              <p>Sign up in seconds and tell us about your goals — whether it's weight loss, muscle gain, or simply eating healthier. We'll personalize everything for you.</p>
            </div>
          </div>
          <div className="learn-item">
            <div className="number">2</div>
            <div>
              <h3>Scan & Track Your Meals</h3>
              <p>Use your phone camera to scan any meal. Our AI recognizes the food on your plate, calculates calories, protein, carbs, fats, and more — instantly. You can also log meals manually.</p>
            </div>
          </div>
          <div className="learn-item">
            <div className="number">3</div>
            <div>
              <h3>Get Personalized Guidance</h3>
              <p>Based on your daily intake and goals, DailyBite.fit suggests what to eat next, alerts you if you're missing key nutrients, and adjusts your meal plan in real time.</p>
            </div>
          </div>
          <div className="learn-item">
            <div className="number">4</div>
            <div>
              <h3>See Your Progress</h3>
              <p>Watch your habits transform with detailed weekly and monthly reports. Celebrate milestones, spot trends, and stay motivated on your journey to a healthier life.</p>
            </div>
          </div>
        </div>
        <div className="learn-cta">
          <a href="#get-started">Get Started — It's Free</a>
        </div>
      </section>

      {/* Auth Section */}
      <div id="get-started" style={{ height: 1 }}></div>
      <section className="auth-section">
        <h2>Join DailyBite.fit</h2>
        <p className="subtitle">Create your free account and start your journey today.</p>
        <div className="auth-container">
          <div className="tabs">
            <button className={`tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</button>
            <button className={`tab ${tab === 'signin' ? 'active' : ''}`} onClick={() => switchTab('signin')}>Sign In</button>
          </div>
          <div className="form-container">
            {tab === 'signup' ? (
              <form className="form active" onSubmit={handleSignup}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" placeholder="Create a password" autoComplete="new-password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                {message && <div className={`message ${messageType}`}>{message}</div>}
                <p className="switch-text">Already have an account? <a onClick={() => switchTab('signin')}>Sign In</a></p>
              </form>
            ) : (
              <form className="form active" onSubmit={handleSignin}>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" placeholder="Enter your password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                {message && <div className={`message ${messageType}`}>{message}</div>}
                <p className="switch-text">Don't have an account? <a onClick={() => switchTab('signup')}>Sign Up</a></p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 DailyBite.fit — All rights reserved.</p>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#learn-more">How It Works</a>
          <a href="#get-started">Get Started</a>
          <a href="/privacy.html" target="_blank">Privacy Policy</a>
          <a href="/terms.html" target="_blank">Terms of Service</a>
        </div>
      </footer>
    </div>
  )
}
