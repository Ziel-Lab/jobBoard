import { NextRequest, NextResponse } from 'next/server'
import { getForwardedCookies, hasAuthCookies, unauthorizedResponse } from '@/lib/api-auth-helpers'
import { getSubdomainFromRequest } from '@/lib/subdomain-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ candidate_id: string }> }
) {
	try {
		// Await params in Next.js 15+
		const { candidate_id } = await params
		
		// Check if auth cookies are present
		if (!await hasAuthCookies()) {
			console.error('[Candidate Detail API] No auth cookies found')
			return NextResponse.json(unauthorizedResponse(), { status: 401 })
		}
		
		// Build headers - forward cookies to backend
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'Cookie': await getForwardedCookies(), // Forward HttpOnly cookies to backend
		}
		
		// Get subdomain from request headers or URL
		const subdomain = req.headers.get('X-Company-Subdomain') || getSubdomainFromRequest(req)
		if (subdomain) {
			headers['X-Company-Subdomain'] = subdomain
			console.log('[Candidate Detail API] Using subdomain:', subdomain)
		} else {
			console.warn('[Candidate Detail API] No subdomain provided')
		}

		const endpoint = `/candidates/${candidate_id}`
		const url = `${API_BASE_URL}${endpoint}`
		console.log('[Candidate Detail API] Fetching from:', url)
		
		const response = await fetch(url, {
			method: 'GET',
			headers,
		})
		
		// Handle different response statuses
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ 
				message: response.statusText,
				error: response.statusText 
			}))
			
			console.error('[Candidate Detail API] Backend error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorData
			})
			
			// Handle specific error cases
			if (response.status === 401) {
				return NextResponse.json(
					{ message: 'Invalid or expired token' },
					{ status: 401 }
				)
			}
			
			if (response.status === 403) {
				return NextResponse.json(
					{ message: errorData.message || 'Access forbidden' },
					{ status: 403 }
				)
			}
			
			if (response.status === 404) {
				return NextResponse.json(
					{ message: 'Candidate not found' },
					{ status: 404 }
				)
			}
			
			return NextResponse.json(
				{ message: errorData.message || 'Request failed' },
				{ status: response.status }
			)
		}

		const backendData = await response.json()
		console.log('[Candidate Detail API] Success - fetched candidate:', candidate_id)
		
		// Transform backend response to frontend format
		const rawCandidate = (backendData.candidate || backendData) as Record<string, unknown>
		const transformedCandidate = {
			id: (rawCandidate.applicant_id as string) || (rawCandidate.id as string),
			fullName: (rawCandidate.personal_info as Record<string, unknown>)?.name as string || (rawCandidate.name as string) || '',
			email: (rawCandidate.personal_info as Record<string, unknown>)?.email as string || (rawCandidate.email as string) || '',
			currentRole: (rawCandidate.work_experience as Array<Record<string, unknown>>)?.[0]?.title as string || (rawCandidate.personal_info as Record<string, unknown>)?.level as string || '',
			headline: (rawCandidate.about as string) || '',
			location: (rawCandidate.work_experience as Array<Record<string, unknown>>)?.[0]?.location as string || (rawCandidate.personal_info as Record<string, unknown>)?.location as string || '',
			avatarUrl: undefined,
			summary: (rawCandidate.about as string) || '',
			skills: ((rawCandidate.skills_expertise as Array<string>) || []),
			topSkills: ((rawCandidate.skills_expertise as Array<string>) || []).slice(0, 10),
			yearsOfExperience: (rawCandidate.personal_info as Record<string, unknown>)?.experience_years as number,
			experienceYears: (rawCandidate.personal_info as Record<string, unknown>)?.experience_years as number,
			experienceLevel: ((rawCandidate.personal_info as Record<string, unknown>)?.level as string)?.toLowerCase() || '',
			availability: (rawCandidate.personal_info as Record<string, unknown>)?.available_immediately ? 'immediate' : undefined,
			openToRemote: ((rawCandidate.personal_info as Record<string, unknown>)?.job_preferences as Record<string, unknown>)?.open_to_remote as boolean || false,
			preferredJobTypes: (((rawCandidate.personal_info as Record<string, unknown>)?.job_preferences as Record<string, unknown>)?.types as Array<string>) || [],
			expectedSalaryMin: ((rawCandidate.personal_info as Record<string, unknown>)?.salary_expectations as Record<string, unknown>)?.min as number,
			expectedSalaryMax: ((rawCandidate.personal_info as Record<string, unknown>)?.salary_expectations as Record<string, unknown>)?.max as number,
			currency: ((rawCandidate.personal_info as Record<string, unknown>)?.salary_expectations as Record<string, unknown>)?.currency as string || 'USD',
			isBookmarked: (rawCandidate.is_bookmarked as boolean) || false,
			resumeUrl: ((rawCandidate.application as Record<string, unknown>)?.resume_url as string),
			matchScores: {
				overallScore: ((rawCandidate.match_scores as Record<string, unknown>)?.overall as number),
				skillsMatch: ((rawCandidate.match_scores as Record<string, unknown>)?.skills as number),
				experienceMatch: ((rawCandidate.match_scores as Record<string, unknown>)?.experience as number),
				educationMatch: ((rawCandidate.match_scores as Record<string, unknown>)?.education as number),
			},
			contact: {
				phone: (rawCandidate.personal_info as Record<string, unknown>)?.phone as string,
				email: (rawCandidate.personal_info as Record<string, unknown>)?.email as string,
				linkedin: (rawCandidate.personal_info as Record<string, unknown>)?.linkedin_url as string,
				website: (rawCandidate.personal_info as Record<string, unknown>)?.website as string,
			},
			workExperience: ((rawCandidate.work_experience as Array<Record<string, unknown>>) || []).map((exp, index: number) => ({
				id: `exp-${index}`,
				role: exp.title as string,
				company: exp.company as string,
				location: exp.location as string,
				startDate: (exp.duration as string)?.split('-')?.[0]?.trim() || '',
				endDate: (exp.duration as string)?.includes('Present') ? undefined : (exp.duration as string)?.split('-')?.[1]?.trim(),
				isCurrent: (exp.duration as string)?.includes('Present') || false,
				summary: (exp.description as Array<string>)?.[0] || '',
				achievements: (exp.description as Array<string>) || [],
			})),
			education: ((rawCandidate.education as Array<Record<string, unknown>>) || []).map((edu, index: number) => ({
				id: `edu-${index}`,
				school: edu.institution as string,
				degree: edu.degree as string,
				fieldOfStudy: '',
				location: (edu.location as string) || '',
				startDate: (edu.duration as string)?.split('-')?.[0]?.trim(),
				endDate: (edu.duration as string)?.split('-')?.[1]?.trim(),
			})),
			certifications: ((rawCandidate.certifications as Array<Record<string, unknown>>) || []).map((cert, index: number) => ({
				id: (cert.id as string) || `cert-${index}`,
				name: cert.title as string,
				issuer: cert.organization as string,
				date: cert.date as string,
				credentialId: (cert.id as string) !== 'N/A' ? (cert.id as string) : undefined,
			})),
			projects: ((rawCandidate.projects as Array<Record<string, unknown>>) || []).map((proj, index: number) => ({
				id: `proj-${index}`,
				name: proj.name as string,
				description: proj.description as string,
				link: (proj.link as string) !== 'N/A' ? (proj.link as string) : undefined,
				technologies: ((proj.tags as Array<string>) || []),
			})),
			applications: ((rawCandidate.applied_jobs as Array<Record<string, unknown>>) || []).map((app) => ({
				id: app.application_id as string,
				jobId: app.job_id as string,
				jobTitle: app.job_title as string,
				status: app.status as string,
				appliedAt: app.applied_at as string,
				resumeUrl: ((rawCandidate.application as Record<string, unknown>)?.resume_url as string),
				coverLetter: ((rawCandidate.application as Record<string, unknown>)?.cover_letter as string),
				matchScores: {
					overallScore: ((rawCandidate.match_scores as Record<string, unknown>)?.overall as number),
					skillsMatch: ((rawCandidate.match_scores as Record<string, unknown>)?.skills as number),
					experienceMatch: ((rawCandidate.match_scores as Record<string, unknown>)?.experience as number),
					educationMatch: ((rawCandidate.match_scores as Record<string, unknown>)?.education as number),
				},
			})),
			lastActive: (rawCandidate.updated_at as string) || (rawCandidate.created_at as string) || new Date().toISOString(),
		}
		
		// Wrap in success envelope to match authenticated-api expectations
		return NextResponse.json({
			success: true,
			data: { candidate: transformedCandidate },
			message: 'Candidate retrieved successfully'
		})
	} catch (error) {
		console.error('[Candidate Detail API] Error:', error)
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

