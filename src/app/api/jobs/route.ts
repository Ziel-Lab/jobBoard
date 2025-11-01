import { NextRequest, NextResponse } from 'next/server'
import { getForwardedCookies, hasAuthCookies, unauthorizedResponse } from '@/lib/api-auth-helpers'
import { getSubdomainFromRequest } from '@/lib/subdomain-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

async function proxyRequest(
	req: NextRequest,
	endpoint: string,
	method: string,
	body?: unknown
) {
	try {
		// Check if auth cookies are present
		if (!await hasAuthCookies()) {
			console.error('[Jobs API Proxy] No auth cookies found')
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}
		
		// Build headers - forward cookies to backend
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'Cookie': await getForwardedCookies(), // ✅ Forward HttpOnly cookies to backend
		}
		
		// Get subdomain from request headers or URL
		const subdomain = req.headers.get('X-Company-Subdomain') || getSubdomainFromRequest(req)
		if (subdomain) {
			headers['X-Company-Subdomain'] = subdomain
			console.log('[Jobs API Proxy] Using subdomain:', subdomain)
		} else {
			console.warn('[Jobs API Proxy] No subdomain provided')
		}

		const url = `${API_BASE_URL}${endpoint}`
		console.log('[Jobs API Proxy] Proxying to:', url)
		
		const options: RequestInit = {
			method,
			headers,
		}

		if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
			options.body = JSON.stringify(body)
		}

		const response = await fetch(url, options)
		
		// Handle different response statuses
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ 
				message: response.statusText,
				error: response.statusText 
			}))
			
			console.error('[Jobs API Proxy] Backend error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorData
			})
			
			// Handle specific error cases
			if (response.status === 401) {
				return NextResponse.json(
					{ success: false, message: 'Invalid or expired token', data: null },
					{ status: 401 }
				)
			}
			
			if (response.status === 403) {
				return NextResponse.json(
					{ success: false, message: errorData.message || 'Access forbidden - subdomain may not match your company', data: null },
					{ status: 403 }
				)
			}
			
			if (response.status === 400) {
				return NextResponse.json(
					{ success: false, message: errorData.message || 'Invalid request data', data: null },
					{ status: 400 }
				)
			}
			
			return NextResponse.json(
				{ success: false, message: errorData.message || 'Request failed', data: null },
				{ status: response.status }
			)
		}

		// Handle 204 No Content
		if (response.status === 204) {
			return NextResponse.json({ success: true, data: null })
		}

		const data = await response.json()
		console.log('[Jobs API Proxy] Success response received')
		return NextResponse.json({ success: true, data, message: 'Success' })
	} catch (error) {
		console.error('[Jobs API Proxy] Error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error', data: null },
			{ status: 500 }
		)
	}
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const queryString = searchParams.toString()
	const endpoint = `/jobs${queryString ? `?${queryString}` : ''}`
	
	return proxyRequest(req, endpoint, 'GET')
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		return proxyRequest(req, '/jobs', 'POST', body)
	} catch (error) {
		console.error('[Jobs API] Error parsing request body:', error)
		return NextResponse.json(
			{ success: false, message: 'Invalid request body', data: null },
			{ status: 400 }
		)
	}
}
