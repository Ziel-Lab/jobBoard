export type AuthHeaders = Record<string, string>

interface TokenData {
  access_token: string
  expires_at?: number
  user_id?: string
  subdomain?: string
}

export function setAccessToken(token?: string, expiresAt?: number, userId?: string, subdomain?: string) {
  // Avoid storing access tokens in localStorage (security risk).
  // Keep a minimal client-side metadata record (non-sensitive) to aid UI routing.
  if (typeof window === 'undefined') return

  // Only store non-sensitive metadata. Do NOT persist the access token.
  if (expiresAt) {
    try {
      localStorage.setItem('expires_at', expiresAt.toString())
    } catch {
      // ignore localStorage failures
    }
  }

  if (userId) {
    try {
      localStorage.setItem('user_id', userId)
    } catch {}
  }

  if (subdomain) {
    try {
      localStorage.setItem('subdomain', subdomain)
    } catch {}
  }
}

export function getAuthHeaders(): AuthHeaders {
  const headers: AuthHeaders = { 'Content-Type': 'application/json' }

  // We rely on HttpOnly cookies being sent with requests (credentials: 'include').
  // Do NOT attach Authorization header by default since tokens aren't stored client-side.
  // If callers have an explicit token (e.g., from a magic link flow) they should
  // use `attachAuthHeader` helper below to add Authorization.

  // Include known non-sensitive metadata (subdomain) when available for routing
  if (typeof window !== 'undefined') {
    try {
      let sub = localStorage.getItem('subdomain')
      
      // For localhost development, use a default subdomain if none is found
      if (!sub && window.location.hostname === 'localhost') {
        sub = 'symb-technologies' // Default subdomain for localhost development
      }
      
      if (sub) headers['X-Company-Subdomain'] = sub
    } catch {}
  }

  return headers
}

// Helper to attach Authorization header when the caller explicitly provides a token.
export function attachAuthHeader(headers: AuthHeaders, token?: string) {
  if (!token) return headers
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  }
}

export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true
  
  const expiresAt = localStorage.getItem('expires_at')
  if (!expiresAt) return true
  
  return Date.now() > parseInt(expiresAt) * 1000
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  // Remove only client-side metadata
  try {
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user_id')
    localStorage.removeItem('subdomain')
    // Do not attempt to remove HttpOnly access cookie here — server must clear it.
  } catch {}
}

export interface ApiError extends Error {
  status?: number
  response?: {
    status: number
  }
}

export function handleAuthError(error: ApiError) {
  // Check for 401/403 errors
  // Backend auto-refreshes tokens, so 401 usually means refresh failed - redirect to login
  if (error?.response?.status === 401 || error?.response?.status === 403 || 
      error?.status === 401 || error?.status === 403) {
    clearAuth()
    // Redirect to login when authentication fails (refresh token expired or invalid)
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return
  }
  
  throw error
}

export function getAuthData(): TokenData | null {
  if (typeof window === 'undefined') return null

  // Access token is intentionally not stored client-side. Return available metadata.
  const user_id = localStorage.getItem('user_id') || undefined
  const subdomain = localStorage.getItem('subdomain') || undefined
  const expires_at_raw = localStorage.getItem('expires_at') || '0'

  return {
    access_token: '',
    expires_at: parseInt(expires_at_raw),
    user_id,
    subdomain,
  }
}