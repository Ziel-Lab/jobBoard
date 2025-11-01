import { NextRequest, NextResponse } from 'next/server'
import { getForwardedCookies, hasAuthCookies, unauthorizedResponse } from '@/lib/api-auth-helpers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

// POST upload company logo
export async function POST(request: NextRequest) {
	try {
		// Check if auth cookies are present
		if (!await hasAuthCookies()) {
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

		// Upload to backend - forward cookies
		const backendUrl = `${API_BASE_URL}/company/upload-logo`
		console.log('[Upload Logo] Uploading to backend:', backendUrl)
		console.log('[Upload Logo] File details:', { name: file.name, size: file.size, type: file.type })
		
		// Build headers
		const headers: Record<string, string> = {
			'Cookie': await getForwardedCookies(), // ✅ Forward HttpOnly cookies to backend
		}
		
		// Add subdomain if present (may be required by backend)
		const subdomain = request.headers.get('X-Company-Subdomain')
		if (subdomain) {
			headers['X-Company-Subdomain'] = subdomain
			console.log('[Upload Logo] Adding subdomain header:', subdomain)
		}
		
		const response = await fetch(backendUrl, {
			method: 'POST',
			headers,
			body: backendFormData,
		})

		console.log('[Upload Logo] Backend response status:', response.status)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('[Upload Logo] Backend error:', { status: response.status, error: errorData })
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

