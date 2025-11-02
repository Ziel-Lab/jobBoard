import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function POST(req: NextRequest) {
	try {
		// Get the FormData from the request
		const formData = await req.formData()
		
		// Forward the request to the backend
		const backendUrl = `${BACKEND_API_URL}/applicants/upload-resume`
		
		const response = await fetch(backendUrl, {
			method: 'POST',
			body: formData,
		})

		const data = await response.json()

		if (!response.ok) {
			return NextResponse.json(
				{ 
					success: false, 
					message: data.message || data.error || 'Failed to upload resume' 
				},
				{ status: response.status }
			)
		}

		return NextResponse.json({
			success: true,
			data,
		})
	} catch (error) {
		console.error('Resume upload error:', error)
		return NextResponse.json(
			{ 
				success: false, 
				message: error instanceof Error ? error.message : 'Failed to upload resume' 
			},
			{ status: 500 }
		)
	}
}

