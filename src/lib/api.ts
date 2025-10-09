'use client'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

async function request<T>(path: string, options?: { method?: HttpMethod; body?: unknown; token?: string }) {
	const { method = 'GET', body, token } = options || {}
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		...(body ? { body: JSON.stringify(body) } : {}),
	})

	if (!res.ok) {
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
	accessToken: string
	refreshToken?: string
	user?: { id: string; email: string; role?: string }
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

export function teamInvite(payload: { email: string; role: string }, token: string) {
	return request<void>('/team/invite', { method: 'POST', body: payload, token })
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


