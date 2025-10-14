import { NextRequest, NextResponse } from 'next/server'
import { getAccessTokenFromRequest, unauthorizedResponse } from '@/lib/api-auth-helpers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

// POST upload company logo
export async function POST(request: NextRequest) {
	try {
		// Get auth token from cookies or header
		const accessToken = await getAccessTokenFromRequest(request)

		if (!accessToken) {
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}

		// Get form data from request
		const formData = await request.formData()
		const file = formData.get('file') as File

		if (!file) {
			return NextResponse.json(
				{ success: false, message: 'No file provided' },
				{ status: 400 }
			)
		}

		// Validate file type
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ success: false, message: 'Invalid file type. Only PNG, JPG, and SVG are allowed' },
				{ status: 400 }
			)
		}

		// Validate file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			return NextResponse.json(
				{ success: false, message: 'File size must be less than 2MB' },
				{ status: 400 }
			)
		}

		// Create new FormData for backend request
		const backendFormData = new FormData()
		backendFormData.append('file', file, file.name)

		// Upload to backend
		const response = await fetch(`${API_BASE_URL}/company/upload-logo`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
			},
			body: backendFormData,
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			return NextResponse.json(
				{
					success: false,
					message: errorData.message || 'Failed to upload logo',
				},
				{ status: response.status }
			)
		}

		const data = await response.json()
		return NextResponse.json({ success: true, data })
	} catch (error) {
		console.error('Error uploading logo:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

