import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for company settings update
const settingsUpdateSchema = z.object({
	companyName: z.string().min(2),
	website: z.string().url().optional().or(z.literal('')),
	primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
	secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
	about: z.string().min(20).max(500),
	logo: z.string().optional(),
})

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		
		// Validate the request body
		const validatedData = settingsUpdateSchema.parse(body)
		
		// TODO: Update company settings in database
		// For now, we'll just log the data and return success
		console.log('Company settings update:', validatedData)
		
		// Simulate processing time
		await new Promise(resolve => setTimeout(resolve, 1000))
		
		return NextResponse.json({
			success: true,
			message: 'Company settings updated successfully',
			data: validatedData,
		})
		
	} catch (error) {
		console.error('Settings update error:', error)
		
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: 'Invalid data provided',
					errors: error.issues,
				},
				{ status: 400 }
			)
		}
		
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
			},
			{ status: 500 }
		)
	}
}

// GET endpoint to retrieve company settings
export async function GET() {
	try {
		// TODO: Fetch company settings from database
		// For now, return mock data
		const mockSettings = {
			companyName: 'TechCorp Inc.',
			website: 'https://techcorp.com',
			primaryColor: '#6366F1',
			secondaryColor: '#10B981',
			about: 'We are a leading technology company focused on building innovative solutions for modern businesses.',
			logo: '',
		}
		
		return NextResponse.json({
			success: true,
			data: mockSettings,
		})
		
	} catch (error) {
		console.error('Settings fetch error:', error)
		
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
			},
			{ status: 500 }
		)
	}
}
