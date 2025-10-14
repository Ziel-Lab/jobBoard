import { NextRequest, NextResponse } from 'next/server'

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
		// Get headers from the incoming request instead of client-side storage
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		}
		
		// Forward the Authorization header from the client request
		const authHeader = req.headers.get('Authorization')
		if (authHeader) {
			headers['Authorization'] = authHeader
		}
		
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

export async function GET(
	req: NextRequest,
	{ params }: { params: { jobId: string } }
) {
	const jobId = params.jobId
	return proxyRequest(req, `/jobs/${jobId}`, 'GET')
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { jobId: string } }
) {
	try {
		const body = await req.json()
		const jobId = params.jobId
		return proxyRequest(req, `/jobs/${jobId}`, 'PUT', body)
	} catch (error) {
		console.error('[Jobs API] Error parsing request body:', error)
		return NextResponse.json(
			{ success: false, message: 'Invalid request body', data: null },
			{ status: 400 }
		)
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { jobId: string } }
) {
	const jobId = params.jobId
	return proxyRequest(req, `/jobs/${jobId}`, 'DELETE')
}

