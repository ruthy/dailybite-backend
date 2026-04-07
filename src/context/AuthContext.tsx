import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

const API_URL = import.meta.env.VITE_API_URL || ''

interface Profile {
  id: string
  name: string
  email: string
  height_cm: number | null
  weight_kg: number | null
  date_of_birth: string | null
  activity_level: string | null
  goal: string | null
  daily_calorie_target: number | null
  lang: string
  onboarding_completed: boolean
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; confirmationRequired?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchCounter = useRef(0)

  async function fetchProfile(userId: string, email?: string) {
    const fetchId = ++fetchCounter.current
    let profileData = null

    // Try backend API first (no token needed, always works)
    if (email) {
      try {
        const resp = await fetch(`${API_URL}/api/profile/${encodeURIComponent(email)}`)
        if (resp.ok) profileData = await resp.json()
      } catch {}
    }

    // Fallback to Supabase client
    if (!profileData) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        profileData = data
      } catch {}
    }

    if (profileData && fetchId === fetchCounter.current) setProfile(profileData)
  }

  async function refreshProfile(): Promise<Profile | null> {
    if (user) {
      const fetchId = ++fetchCounter.current
      let profileData = null

      // Use backend API (always works, no token issues)
      if (user.email) {
        try {
          const resp = await fetch(`/api/profile/${encodeURIComponent(user.email)}`)
          if (resp.ok) profileData = await resp.json()
        } catch {}
      }

      // Fallback
      if (!profileData) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          profileData = data
        } catch {}
      }

      if (profileData && fetchId === fetchCounter.current) {
        setProfile(profileData)
        return profileData
      }
    }
    return null
  }

  useEffect(() => {
    let mounted = true

    // Timeout — never stay loading forever
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false)
    }, 5000)

    // Refresh then get session to ensure valid token
    supabase.auth.refreshSession().catch(() => {}).finally(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          try { await fetchProfile(session.user.id, session.user.email) } catch {}
        }
      } catch {}
      if (mounted) { setLoading(false); clearTimeout(timeout) }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        try { await fetchProfile(session.user.id, session.user.email) } catch {}
      } else {
        setProfile(null)
      }
      if (mounted) setLoading(false)
    })

    return () => { mounted = false; clearTimeout(timeout); subscription.unsubscribe() }
  }, [])

  async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) return { error: error.message }

    // If no session, email confirmation is required
    if (data.user && !data.session) {
      return { error: null, confirmationRequired: true }
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
      })
      if (profileError) return { error: profileError.message }

      // Send welcome email via backend
      const apiUrl = import.meta.env.VITE_API_URL
      if (apiUrl) {
        fetch(`${apiUrl}/api/send-welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, lang: 'en' }),
        }).catch(() => {}) // non-blocking
      }
    }
    return { error: null }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
