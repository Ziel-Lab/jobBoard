import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

function getSubdomainFromRequest(req: NextRequest): string | null {
	const subdomainHeader = req.headers.get('X-Company-Subdomain')
	if (subdomainHeader) return subdomainHeader

	const hostname = req.headers.get('host') || ''
	const parts = hostname.split('.')
	if (parts.length > 2 || (parts.length === 2 && parts[0] !== 'localhost')) {
		const subdomain = parts[0]
		if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
			return subdomain
		}
	}

	// Fallback: accept subdomain via query param for environments without subdomain host
	try {
		const url = new URL(req.url)
		const qpSub = url.searchParams.get('subdomain')
		if (qpSub) return qpSub
	} catch {}
	return null
}

async function proxyRequest(
	req: NextRequest,
	endpoint: string,
	method: string
) {
	try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		}

		const subdomain = getSubdomainFromRequest(req)
		if (subdomain) headers['X-Company-Subdomain'] = subdomain

		const url = `${API_BASE_URL}${endpoint}`
		const response = await fetch(url, {
			method,
			headers,
			credentials: 'include'
		})

		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ message: response.statusText }))
			return NextResponse.json(
				{ success: false, message: errorData.message || 'Request failed', data: null },
				{ status: response.status }
			)
		}

		const data = await response.json()
		return NextResponse.json({ success: true, data, message: 'Success' })
	} catch (error) {
		console.error('[Public Jobs API Proxy] Error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error', data: null },
			{ status: 500 }
		)
	}
}

export async function GET(req: NextRequest) {
    const pathname = req.nextUrl.pathname
    const parts = pathname.split('/')
    const idx = parts.findIndex(p => p === 'public')
    const jobId = idx !== -1 && parts[idx + 1] ? decodeURIComponent(parts[idx + 1]) : null
    if (!jobId) {
        return NextResponse.json(
            { success: false, message: 'Missing jobId', data: null },
            { status: 400 }
        )
    }
    return proxyRequest(req, `/jobs/public/${jobId}`, 'GET')
}


