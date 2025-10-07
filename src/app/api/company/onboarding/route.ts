import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for onboarding data
const onboardingSchema = z.object({
	companyData: z.object({
		companyName: z.string().min(2),
		industry: z.string().min(1),
		size: z.string().min(1),
		location: z.string().min(2),
		website: z.string().url().optional().or(z.literal('')),
		description: z.string().min(10),
	}),
	teamData: z.object({
		teamMembers: z.array(z.object({
			email: z.string().email(),
			role: z.string().min(1),
			department: z.string().min(1),
		})).optional(),
	}),
	preferencesData: z.object({
		jobPostingFrequency: z.string().min(1),
		notificationPreferences: z.object({
			emailNotifications: z.boolean(),
			smsNotifications: z.boolean(),
			marketingEmails: z.boolean(),
		}),
		timezone: z.string().min(1),
	}),
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		
		// Validate the request body
		const validatedData = onboardingSchema.parse(body)
		
		// TODO: Save to database
		// For now, we'll just log the data and return success
		console.log('Company onboarding data:', validatedData)
		
		// Simulate processing time
		await new Promise(resolve => setTimeout(resolve, 1000))
		
		// TODO: Send team member invitations if any
		if (validatedData.teamData.teamMembers && validatedData.teamData.teamMembers.length > 0) {
			console.log('Sending team invitations:', validatedData.teamData.teamMembers)
			// Here you would typically:
			// 1. Create user accounts for team members
			// 2. Send invitation emails
			// 3. Set up proper permissions
		}
		
		return NextResponse.json({
			success: true,
			message: 'Company onboarding completed successfully',
			data: {
				companyId: 'temp-company-id', // TODO: Return actual company ID from database
				teamInvitationsSent: validatedData.teamData.teamMembers?.length || 0,
			},
		})
		
	} catch (error) {
		console.error('Onboarding error:', error)
		
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
