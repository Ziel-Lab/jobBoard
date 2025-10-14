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
	return null
}

export async function GET(req: NextRequest) {
	try {
		const subdomain = getSubdomainFromRequest(req)
		if (!subdomain) {
			return NextResponse.json(
				{ success: false, message: 'X-Company-Subdomain required', data: null },
				{ status: 400 }
			)
		}

		const url = new URL(req.url)
		const jobId = url.searchParams.get('jobId')
		const endpoint = jobId ? `/jobs/public/${jobId}` : `/jobs/public${url.search}`

		const upstream = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Company-Subdomain': subdomain,
			},
			credentials: 'include',
		})

		if (!upstream.ok) {
			const errorData = await upstream.json().catch(() => ({ message: upstream.statusText }))
			return NextResponse.json(
				{ success: false, message: errorData.message || 'Request failed', data: null },
				{ status: upstream.status }
			)
		}

		const data = await upstream.json()
		return NextResponse.json({ success: true, data, message: 'Success' })
	} catch (error) {
		console.error('[Public Jobs API Proxy List] Error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error', data: null },
			{ status: 500 }
		)
	}
}


