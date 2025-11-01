import { NextRequest, NextResponse } from 'next/server'
import { getForwardedCookies, hasAuthCookies, unauthorizedResponse } from '@/lib/api-auth-helpers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

// GET company profile
export async function GET(request: NextRequest) {
	try {
		// Check if auth cookies are present
		if (!await hasAuthCookies()) {
			console.warn('[Company Profile API] No auth cookies found')
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}

		// Fetch company profile from backend - forward cookies
		const response = await fetch(`${API_BASE_URL}/company/profile`, {
			method: 'GET',
			headers: {
				'Cookie': await getForwardedCookies(), // ✅ Forward HttpOnly cookies to backend
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('[Company Profile API] Backend error:', errorData.message || 'Unknown error')
			return NextResponse.json(
				{
					success: false,
					message: errorData.message || 'Failed to fetch company profile',
				},
				{ status: response.status }
			)
		}

		const data = await response.json()
		console.log('[Company Profile API] Successfully fetched company profile')
		return NextResponse.json({ success: true, data })
	} catch (error) {
		console.error('[Company Profile API] Error fetching company profile:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// PUT update company profile
export async function PUT(request: NextRequest) {
	try {
		// Check if auth cookies are present
		if (!await hasAuthCookies()) {
			console.warn('[Company Profile API] No auth cookies found')
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}

		// Get request body
		const body = await request.json()

		// Update company profile in backend - forward cookies
		const response = await fetch(`${API_BASE_URL}/company/profile`, {
			method: 'PUT',
			headers: {
				'Cookie': await getForwardedCookies(), // ✅ Forward HttpOnly cookies to backend
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('[Company Profile API] Backend error:', errorData.message || 'Unknown error')
			return NextResponse.json(
				{
					success: false,
					message: errorData.message || 'Failed to update company profile',
				},
				{ status: response.status }
			)
		}

		const data = await response.json()
		console.log('[Company Profile API] Successfully updated company profile')
		return NextResponse.json({ success: true, data })
	} catch (error) {
		console.error('[Company Profile API] Error updating company profile:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

