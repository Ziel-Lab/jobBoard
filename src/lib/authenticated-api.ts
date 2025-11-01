import { handleAuthError, ApiError } from './auth-utils'
import { getCurrentSubdomain } from '@/lib/subdomain-utils'

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export class AuthenticatedApiClient {
  private baseUrl: string

  constructor() {
    // Keep as optional base for non-proxy endpoints.
    // For '/api/*' we will use same-origin to avoid CORS.
    this.baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
  }

  private resolveUrl(endpoint: string): string {
    if (endpoint.startsWith('/api/')) return endpoint
    if (!this.baseUrl) return endpoint
    return `${this.baseUrl}${endpoint}`
  }

  private buildHeaders(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'): HeadersInit {
    const headers: Record<string, string> = {}
    
    // Only set Content-Type for non-GET requests
    if (method !== 'GET') {
      headers['Content-Type'] = 'application/json'
    }
    
    const sub = getCurrentSubdomain()
    
    // If no subdomain detected from URL, try to get it from localStorage
    let finalSubdomain = sub
    if (!finalSubdomain && typeof window !== 'undefined') {
      try {
        finalSubdomain = localStorage.getItem('subdomain')
      } catch (error) {
        // ignore localStorage errors
      }
    }
    
    // For localhost development, use a default subdomain if none is found
    if (!finalSubdomain && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      finalSubdomain = 'symb-technologies' // Default subdomain for localhost development
    }
    
    if (finalSubdomain) headers['X-Company-Subdomain'] = finalSubdomain
    return headers
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.resolveUrl(endpoint), {
        method: 'GET',
        headers: this.buildHeaders('GET'),
        credentials: 'include' // Ensures cookies are sent with request
      })

      if (!response.ok) {
        // Backend auto-refreshes tokens, so 401 usually means refresh failed
        if (response.status === 401) {
          console.error('[API] 401 Unauthorized on GET', endpoint, '- token refresh likely failed')
          handleAuthError({ status: response.status } as ApiError)
          return { data: null as T, success: false }
        }
        throw new Error(`API Error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('[API] Error on GET', endpoint, error)
      handleAuthError(error as ApiError)
      return { data: null as T, success: false }
    }
  }

  async put<T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.resolveUrl(endpoint), {
        method: 'PUT',
        headers: this.buildHeaders('PUT'),
        credentials: 'include',
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError({ status: response.status } as ApiError)
          return { data: null as T, success: false }
        }
        throw new Error(`API Error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      handleAuthError(error as ApiError)
      return { data: null as T, success: false }
    }
  }

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.resolveUrl(endpoint), {
        method: 'POST',
        headers: this.buildHeaders('POST'),
        credentials: 'include',
        body: JSON.stringify(data)
      })

		if (!response.ok) {
        if (response.status === 401) {
          handleAuthError({ status: response.status } as ApiError)
          return { data: null as T, success: false }
        }
        throw new Error(`API Error: ${response.statusText}`)
      }

      return response.json()
	} catch (error) {
      handleAuthError(error as ApiError)
      return { data: null as T, success: false }
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.resolveUrl(endpoint), {
        method: 'DELETE',
        headers: this.buildHeaders('DELETE'),
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError({ status: response.status } as ApiError)
          return { data: null as T, success: false }
        }
        throw new Error(`API Error: ${response.statusText}`)
      }

      // DELETE might return 204 No Content
      if (response.status === 204) {
        return { data: null as T, success: true }
      }

      return response.json()
    } catch (error) {
      handleAuthError(error as ApiError)
      return { data: null as T, success: false }
    }
  }

  async patch<T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.resolveUrl(endpoint), {
        method: 'PATCH',
        headers: this.buildHeaders('PATCH'),
        credentials: 'include',
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError({ status: response.status } as ApiError)
          return { data: null as T, success: false }
        }
        throw new Error(`API Error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      handleAuthError(error as ApiError)
      return { data: null as T, success: false }
    }
  }

  async uploadFile<T>(endpoint: string, file: File, retryCount = 1): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const headers = this.buildHeaders('POST') as Record<string, string>
      // Let browser set correct content type for FormData
      delete headers['Content-Type']

      const response = await fetch(this.resolveUrl(endpoint), {
        method: 'POST',
        headers: headers as HeadersInit,
        credentials: 'include',
        body: formData
      })

      // Retry once on 404 (backend might be warming up)
      if (response.status === 404 && retryCount > 0) {
        console.log('[Upload] Got 404, retrying after 500ms...')
        await new Promise(resolve => setTimeout(resolve, 500))
        return this.uploadFile(endpoint, file, retryCount - 1)
      }

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError({ status: response.status } as ApiError)
          return { data: null as T, success: false }
        }
        throw new Error(`API Error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      handleAuthError(error as ApiError)
      return { data: null as T, success: false }
    }
  }
}

const api = new AuthenticatedApiClient()
export { api }