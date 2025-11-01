import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * On-demand revalidation endpoint for job pages
 * Triggers cache refresh only when job data actually changes
 * This is more efficient than time-based revalidation
 */
export async function POST(request: NextRequest) {
	try {
		// Verify secret token to prevent unauthorized revalidation
		const authHeader = request.headers.get('authorization')
		const secret = process.env.REVALIDATION_SECRET || 'default-secret-change-in-production'
		
		if (authHeader !== `Bearer ${secret}`) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { jobId, subdomain } = body

		if (!jobId) {
			return NextResponse.json(
				{ error: 'Job ID is required' },
				{ status: 400 }
			)
		}

		// Revalidate the specific job page
		revalidatePath(`/jobs/${jobId}`)
		
		// If subdomain is provided, also revalidate subdomain-specific paths
		if (subdomain) {
			revalidatePath(`/_subdomain/${subdomain}/careers`)
		}

		// Also revalidate the jobs list page
		revalidatePath('/jobs')
		revalidatePath('/employer/jobs')

		return NextResponse.json({
			success: true,
			revalidated: true,
			paths: [`/jobs/${jobId}`, '/jobs', '/employer/jobs'],
			timestamp: new Date().toISOString()
		})
	} catch (error) {
		console.error('Revalidation error:', error)
		return NextResponse.json(
			{ 
				error: 'Failed to revalidate',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		)
	}
}

