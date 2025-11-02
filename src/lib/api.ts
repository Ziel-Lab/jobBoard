'use client'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// Use Next.js proxy routes on the same origin to avoid CORS in the browser.
const API_BASE_PATH = '/api'

async function request<T>(path: string, options?: { method?: HttpMethod; body?: unknown }) {
	const { method = 'GET', body } = options || {}
	const url = `${API_BASE_PATH}${path}`
	const headers: Record<string, string> = {}
	// Only set JSON content-type when sending a JSON body
	if (body && !(body instanceof FormData)) {
		headers['Content-Type'] = 'application/json'
	}
	// Backend uses HttpOnly cookies for authentication, so no Authorization header needed
	// Cookies are automatically sent with credentials: 'include'

	const res = await fetch(url, {
		method,
		headers,
		credentials: 'include', // Include cookies (HttpOnly tokens) with all requests
		...(body ? { body: JSON.stringify(body) } : {}),
	})

	if (!res.ok) {
		// Handle 401 Unauthorized - backend auto-refreshes tokens, so 401 usually means refresh failed
		if (res.status === 401) {
			// Clear client-side auth metadata and redirect to login
			if (typeof window !== 'undefined') {
				try {
					localStorage.removeItem('expires_at')
					localStorage.removeItem('user_id')
					localStorage.removeItem('subdomain')
				} catch {}
				window.location.href = '/login'
				return undefined as unknown as T // Return early to prevent further processing
			}
		}
		
		let message = 'Request failed'
		try {
			const data = (await res.json()) as { message?: string; error?: string }
			message = data.message || data.error || message
		} catch {}
		throw new Error(message)
	}

	try {
		return (await res.json()) as T
	} catch {
		// no body
		return undefined as unknown as T
	}
}

export interface LoginResponse {
	message: string
	needsCompanySetup?: boolean
	profile?: {
		id: string
		email: string
		role: string
		company_id?: string
		onboarding_completed?: boolean
	} | null
	redirectUrl?: string
	companyId?: string | null
	subdomain?: string | null
	session?: {
		access_token: string
		refresh_token?: string
		expires_at: number
	}
	user?: {
		id: string
		email: string
		role?: string
	}
	// Legacy format support (camelCase)
	accessToken?: string
	refreshToken?: string
	// Snake_case format support
	access_token?: string
	refresh_token?: string
}

export function authLogin(payload: { email: string; password: string }) {
	return request<LoginResponse>('/auth/login', { method: 'POST', body: payload })
}

export function authRegisterCompany(payload: {
	email: string
	password: string
	companyName: string
	subdomain: string
	fullName: string
}) {
	return request<{ companyId: string; ownerId: string }>('/auth/register/company', {
		method: 'POST',
		body: payload,
	})
}

export function authAcceptInvitation(payload: {
	token: string
	password: string
	fullName: string
}) {
	return request<LoginResponse>('/auth/accept-invitation', { method: 'POST', body: payload })
}

export function teamInvite(payload: { email: string; role: string }) {
	// Backend uses HttpOnly cookies for authentication, no token parameter needed
	return request<void>('/team/invite', { method: 'POST', body: payload })
}

export function healthLive() {
	return request<{ status: string }>('/health/live')
}

export function setupSuperAdmin(payload: {
	email: string
	password: string
	fullName: string
}) {
	return request<void>('/auth/setup/super-admin', { method: 'POST', body: payload })
}


export function authVerifyEmail(payload: {
	access_token: string
	type: 'signup' | 'recovery'
	refresh_token?: string
}) {
	return request<LoginResponse>('/auth/verify-email', { method: 'POST', body: payload })
}

// Forgot password – request reset email
export function authForgotPassword(payload: { email: string }) {
	return request<void>('/auth/forgot-password', { method: 'POST', body: payload })
}

// Reset password with recovery token
export function authResetPassword(payload: { access_token: string; new_password: string }) {
	return request<void>('/auth/reset-password', { method: 'POST', body: payload })
}

export function authSignup(payload: { name: string; email: string; password: string }) {
	return request<void>('/auth/signup', { method: 'POST', body: payload })
}

export function getOauthUrl(params: { provider: 'google' | 'linkedin'; redirect_to: string }) {
	const qp = new URLSearchParams({ provider: params.provider, redirect_to: params.redirect_to })
	return request<{ url: string }>(`/auth/oauth/url?${qp.toString()}`)
}

// Applicant APIs
export interface UploadResumeResponse {
	success: boolean
	data?: {
		resumeUrl: string
		message?: string
	}
	message?: string
}

export interface SubmitApplicationPayload {
	jobId: string
	fullName: string
	email: string
	phone: string
	resumeUrl: string
	coverLetter?: string
	linkedinUrl?: string
	portfolioUrl?: string
}

export interface SubmitApplicationResponse {
	success: boolean
	data?: {
		applicationId?: string
		message?: string
	}
	message?: string
}

export async function uploadResume(file: File): Promise<UploadResumeResponse> {
	const formData = new FormData()
	formData.append('file', file)
	
	const url = `${API_BASE_PATH}/applicants/upload-resume`
	
	const res = await fetch(url, {
		method: 'POST',
		credentials: 'include',
		body: formData,
	})
	
	if (!res.ok) {
		let message = 'Failed to upload resume'
		try {
			const data = await res.json() as { message?: string; error?: string }
			message = data.message || data.error || message
		} catch {}
		throw new Error(message)
	}
	
	return await res.json() as UploadResumeResponse
}

export function submitApplication(payload: SubmitApplicationPayload) {
	return request<SubmitApplicationResponse>('/applicants/submit', {
		method: 'POST',
		body: payload,
	})
}

