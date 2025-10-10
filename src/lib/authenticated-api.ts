import { getAuthHeaders, handleAuthError, ApiError } from './auth-utils'
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
    const headers = { ...getAuthHeaders() } as Record<string, string>
    // Avoid sending Content-Type on GET to prevent preflight on some backends
    if (method === 'GET') {
      delete headers['Content-Type']
    }
    const sub = getCurrentSubdomain()
    if (sub) headers['X-Company-Subdomain'] = sub
    return headers
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.resolveUrl(endpoint), {
        method: 'GET',
        headers: this.buildHeaders('GET'),
        credentials: 'include'
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

  async uploadFile<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
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