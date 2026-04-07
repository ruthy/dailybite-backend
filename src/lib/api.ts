import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

const API_BASE = isNative
  ? 'https://dailybite-backend-pw2i.onrender.com'
  : ''

// Override global fetch to auto-prefix /api calls on native
const originalFetch = window.fetch.bind(window)
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('/api') && API_BASE) {
    return originalFetch(API_BASE + input, init)
  }
  return originalFetch(input, init)
}

export {}
