export type AuthHeaders = Record<string, string>

interface TokenData {
  access_token: string
  expires_at?: number
  user_id?: string
  subdomain?: string
}

/**
 * Store non-sensitive client-side metadata after login.
 * DO NOT pass access tokens here - they are stored as HttpOnly cookies by the backend.
 * This only stores metadata needed for UI routing and state management.
 */
export function storeAuthMetadata(metadata: {
  expiresAt?: number
  userId?: string
  subdomain?: string
}) {
  if (typeof window === 'undefined') return

  const { expiresAt, userId, subdomain } = metadata

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

/**
 * @deprecated Use storeAuthMetadata instead. This function name is misleading.
 */
export function setAccessToken(token?: string, expiresAt?: number, userId?: string, subdomain?: string) {
  storeAuthMetadata({ expiresAt, userId, subdomain })
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