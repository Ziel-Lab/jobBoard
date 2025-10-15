import { NextRequest, NextResponse } from 'next/server'
import { getAccessTokenFromRequest, unauthorizedResponse } from '@/lib/api-auth-helpers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

function getSubdomainFromRequest(req: NextRequest): string | null {
	// Try to get from header first (set by middleware or client)
	const subdomainHeader = req.headers.get('X-Company-Subdomain')
	if (subdomainHeader) {
		return subdomainHeader
	}

	// Extract from hostname
	const hostname = req.headers.get('host') || ''
	const parts = hostname.split('.')
	
	// Check if it's a subdomain (e.g., company.localhost:3000 or company.example.com)
	if (parts.length > 2 || (parts.length === 2 && parts[0] !== 'localhost')) {
		const subdomain = parts[0]
		// Filter out common non-subdomain prefixes
		if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
			return subdomain
		}
	}
	
	return null
}

async function proxyRequest(
	req: NextRequest,
	endpoint: string,
	method: string,
	body?: unknown
) {
	try {
		// Build headers and attach server-side token from HttpOnly cookie
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		}
		// Read token via helper (cookies or Authorization fallback)
		const accessToken = await getAccessTokenFromRequest(req)
		if (!accessToken) {
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}
		headers['Authorization'] = `Bearer ${accessToken}`
		
		const subdomain = getSubdomainFromRequest(req)
		if (subdomain) {
			headers['X-Company-Subdomain'] = subdomain
		}

		const url = `${API_BASE_URL}${endpoint}`
		
		const options: RequestInit = {
			method,
			headers,
			credentials: 'include',
		}

		if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
			options.body = JSON.stringify(body)
		}

		const response = await fetch(url, options)
		
		// Handle different response statuses
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: response.statusText }))
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
		return NextResponse.json({ success: true, data, message: 'Success' })
	} catch (error) {
		console.error('[Jobs API Proxy] Error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error', data: null },
			{ status: 500 }
		)
	}
}

function getJobIdFromRequest(req: NextRequest): string | null {
    const pathname = req.nextUrl.pathname
    const parts = pathname.split('/')
    const idx = parts.findIndex(p => p === 'jobs')
    if (idx !== -1 && parts[idx + 1]) return decodeURIComponent(parts[idx + 1])
    return null
}

export async function GET(req: NextRequest) {
    const jobId = getJobIdFromRequest(req)
    if (!jobId) {
        return NextResponse.json(
            { success: false, message: 'Missing jobId', data: null },
            { status: 400 }
        )
    }
    return proxyRequest(req, `/jobs/${jobId}`, 'GET')
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json()
        const jobId = getJobIdFromRequest(req)
        if (!jobId) {
            return NextResponse.json(
                { success: false, message: 'Missing jobId', data: null },
                { status: 400 }
            )
        }
		return proxyRequest(req, `/jobs/${jobId}`, 'PUT', body)
	} catch (error) {
		console.error('[Jobs API] Error parsing request body:', error)
		return NextResponse.json(
			{ success: false, message: 'Invalid request body', data: null },
			{ status: 400 }
		)
	}
}

export async function DELETE(req: NextRequest) {
    const jobId = getJobIdFromRequest(req)
    if (!jobId) {
        return NextResponse.json(
            { success: false, message: 'Missing jobId', data: null },
            { status: 400 }
        )
    }
	return proxyRequest(req, `/jobs/${jobId}`, 'DELETE')
}

