import { NextRequest, NextResponse } from 'next/server'
import { getAccessTokenFromRequest, unauthorizedResponse } from '@/lib/api-auth-helpers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

// GET company profile
export async function GET(request: NextRequest) {
	try {
		// Get auth token from cookies or header
		const accessToken = await getAccessTokenFromRequest(request)

		if (!accessToken) {
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}

		// Fetch company profile from backend
		const response = await fetch(`${API_BASE_URL}/company/profile`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			return NextResponse.json(
				{
					success: false,
					message: errorData.message || 'Failed to fetch company profile',
				},
				{ status: response.status }
			)
		}

		const data = await response.json()
		return NextResponse.json({ success: true, data })
	} catch (error) {
		console.error('Error fetching company profile:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// PUT update company profile
export async function PUT(request: NextRequest) {
	try {
		// Get auth token from cookies or header
		const accessToken = await getAccessTokenFromRequest(request)

		if (!accessToken) {
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}

		// Get request body
		const body = await request.json()

		// Update company profile in backend
		const response = await fetch(`${API_BASE_URL}/company/profile`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			return NextResponse.json(
				{
					success: false,
					message: errorData.message || 'Failed to update company profile',
				},
				{ status: response.status }
			)
		}

		const data = await response.json()
		return NextResponse.json({ success: true, data })
	} catch (error) {
		console.error('Error updating company profile:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

