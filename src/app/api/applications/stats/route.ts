import { NextRequest, NextResponse } from 'next/server'
import { getForwardedCookies, hasAuthCookies, unauthorizedResponse } from '@/lib/api-auth-helpers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

// GET application stats
export async function GET(request: NextRequest) {
	try {
		// Check if auth cookies are present
		if (!await hasAuthCookies()) {
			console.warn('[Applications Stats API] No auth cookies found')
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}

		// Fetch application stats from backend - forward cookies
		const response = await fetch(`${API_BASE_URL}/applications/stats`, {
			method: 'GET',
			headers: {
				'Cookie': await getForwardedCookies(), // ✅ Forward HttpOnly cookies to backend
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('[Applications Stats API] Backend error:', errorData.message || 'Unknown error')
			return NextResponse.json(
				{
					success: false,
					message: errorData.message || 'Failed to fetch application stats',
				},
				{ status: response.status }
			)
		}

		const data = await response.json()
		console.log('[Applications Stats API] Successfully fetched application stats:', data)
		return NextResponse.json({ success: true, data })
	} catch (error) {
		console.error('[Applications Stats API] Error fetching application stats:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

