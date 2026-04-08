import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

// Fallback detection: if running on capacitor:// or https://localhost, we're native
const isNativeFallback =
  window.location.protocol === 'capacitor:' ||
  (window.location.protocol === 'https:' && window.location.hostname === 'localhost')

const shouldProxy = isNative || isNativeFallback

const API_BASE = shouldProxy
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
