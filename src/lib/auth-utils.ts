export type AuthHeaders = Record<string, string>

interface TokenData {
  access_token: string
  expires_at?: number
  user_id?: string
  subdomain?: string
}

export function setAccessToken(token: string, expiresAt?: number, userId?: string, subdomain?: string) {
  if (typeof window === 'undefined') return

  // Store token
  localStorage.setItem('access_token', token)
  
  // Store expiration if provided
  if (expiresAt) {
    localStorage.setItem('expires_at', expiresAt.toString())
  }
  
  // Store user ID if provided
  if (userId) {
    localStorage.setItem('user_id', userId)
  }
  
  // Store subdomain if provided
  if (subdomain) {
    localStorage.setItem('subdomain', subdomain)
  }
}

export function getAuthHeaders(): AuthHeaders {
  const headers: AuthHeaders = { 'Content-Type': 'application/json' }

  // Only access localStorage on client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token') || ''
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true
  
  const expiresAt = localStorage.getItem('expires_at')
  if (!expiresAt) return true
  
  return Date.now() > parseInt(expiresAt) * 1000
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('access_token')
  localStorage.removeItem('expires_at')
  localStorage.removeItem('user_id')
  localStorage.removeItem('subdomain')
}

export interface ApiError extends Error {
  status?: number
  response?: {
    status: number
  }
}

export function handleAuthError(error: ApiError) {
  // Check for 401/403 errors
  if (error?.response?.status === 401 || error?.response?.status === 403 || 
      error?.status === 401 || error?.status === 403) {
    clearAuth()
    window.location.href = '/login'
    return
  }
  
  throw error
}

export function getAuthData(): TokenData | null {
  if (typeof window === 'undefined') return null

  const access_token = localStorage.getItem('access_token')
  if (!access_token) return null

  return {
    access_token,
    expires_at: parseInt(localStorage.getItem('expires_at') || '0'),
    user_id: localStorage.getItem('user_id') || undefined,
    subdomain: localStorage.getItem('subdomain') || undefined
  }
}