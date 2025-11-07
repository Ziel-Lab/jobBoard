import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for onboarding data (matches frontend structure)
const onboardingSchema = z.object({
	companyData: z.object({
		companyName: z.string().min(2),
		industry: z.string().min(1),
		size: z.string().min(1),
		location: z.string().min(2),
		website: z.string().url().optional().or(z.literal('')),
		description: z.string().min(10),
		subdomain: z.string()
			.min(3)
			.max(63)
			.regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/)
			.optional()
			.or(z.literal('')), // Allow empty string, will fall back to auto-generation
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
		
		// Generate subdomain from company name (fallback if user didn't provide one)
		const generateSubdomain = (companyName: string): string => {
			return companyName
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '') // Remove special characters
				.replace(/\s+/g, '-') // Replace spaces with hyphens
				.replace(/-+/g, '-') // Replace multiple hyphens with single
				.replace(/^-|-$/g, '') // Remove leading/trailing hyphens
				.slice(0, 63) // Limit to 63 characters
		}

		// Use user-provided subdomain or generate one from company name
		const subdomain = validatedData.companyData.subdomain && validatedData.companyData.subdomain.trim()
			? validatedData.companyData.subdomain.toLowerCase().trim()
			: generateSubdomain(validatedData.companyData.companyName)

		// Transform frontend data structure to match backend API expectations
		const backendPayload = {
			company: {
				company_name: validatedData.companyData.companyName,
				industry: validatedData.companyData.industry,
				company_size: validatedData.companyData.size,
				location: validatedData.companyData.location,
				website_url: validatedData.companyData.website || '',
				company_description: validatedData.companyData.description,
				subdomain: subdomain,
			},
			team: (validatedData.teamData.teamMembers || []).map(member => ({
				email: member.email,
				role: member.role,
				department: member.department,
			})),
			settings: {
				timezone: validatedData.preferencesData.timezone,
				jobPostingFrequency: validatedData.preferencesData.jobPostingFrequency,
				notifications: {
					email: validatedData.preferencesData.notificationPreferences.emailNotifications,
					sms: validatedData.preferencesData.notificationPreferences.smsNotifications,
					marketingEmails: validatedData.preferencesData.notificationPreferences.marketingEmails,
				},
			},
		}
		
		console.log('Transformed payload for backend:', backendPayload)
		
		// Forward the request to the backend API
		const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'
		const backendResponse = await fetch(`${backendUrl}/company/onboarding`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Forward the authorization header if present
				...(request.headers.get('authorization') && {
					'Authorization': request.headers.get('authorization')!
				}),
				// Forward cookies for authentication
				...(request.headers.get('cookie') && {
					'Cookie': request.headers.get('cookie')!
				}),
			},
			body: JSON.stringify(backendPayload),
		})
		
		const backendResult = await backendResponse.json()
		
		if (!backendResponse.ok) {
			console.error('Backend API error:', backendResult)
			return NextResponse.json(
				{
					success: false,
					message: backendResult.message || 'Backend API error',
					errors: backendResult.errors || [],
				},
				{ status: backendResponse.status }
			)
		}
		
		// Return the backend response with success status
		return NextResponse.json({
			success: true,
			message: backendResult.message || 'Company onboarding completed successfully',
			...backendResult, // Include subdomain, redirectUrl, etc. from backend
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
