import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		
		// Validate required fields
		const requiredFields = ['jobId', 'fullName', 'email', 'phone', 'resumeUrl']
		const missingFields = requiredFields.filter(field => !body[field])
		
		if (missingFields.length > 0) {
			return NextResponse.json(
				{ 
					success: false, 
					message: `Missing required fields: ${missingFields.join(', ')}` 
				},
				{ status: 400 }
			)
		}
		
		// Forward the request to the backend
		const backendUrl = `${BACKEND_API_URL}/applicants/submit`
		
		const response = await fetch(backendUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		const data = await response.json()

		if (!response.ok) {
			return NextResponse.json(
				{ 
					success: false, 
					message: data.message || data.error || 'Failed to submit application' 
				},
				{ status: response.status }
			)
		}

		return NextResponse.json({
			success: true,
			data,
		})
	} catch (error) {
		console.error('Application submission error:', error)
		return NextResponse.json(
			{ 
				success: false, 
				message: error instanceof Error ? error.message : 'Failed to submit application' 
			},
			{ status: 500 }
		)
	}
}

