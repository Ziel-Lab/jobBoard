import { NextRequest, NextResponse } from 'next/server'
import { getForwardedCookies, hasAuthCookies, unauthorizedResponse } from '@/lib/api-auth-helpers'
import { getSubdomainFromRequest } from '@/lib/subdomain-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function GET(req: NextRequest) {
	try {
		// Check if auth cookies are present
		if (!await hasAuthCookies()) {
			console.error('[Candidates API] No auth cookies found')
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
			console.log('[Candidates API] Using subdomain:', subdomain)
		} else {
			console.warn('[Candidates API] No subdomain provided')
		}

		// Forward all query parameters to the backend
		const { searchParams } = new URL(req.url)
		const queryString = searchParams.toString()
		const endpoint = `/candidates${queryString ? `?${queryString}` : ''}`
		
		const url = `${API_BASE_URL}${endpoint}`
		console.log('[Candidates API] Fetching from:', url)
		
		const backendResponse = await fetch(url, {
			method: 'GET',
			headers,
		})
		
		// Handle different response statuses
		if (!backendResponse.ok) {
			const errorData = await backendResponse.json().catch(() => ({ 
				message: backendResponse.statusText,
				error: backendResponse.statusText 
			}))
			
			console.error('[Candidates API] Backend error:', {
				status: backendResponse.status,
				statusText: backendResponse.statusText,
				error: errorData
			})
			
			// Handle specific error cases
			if (backendResponse.status === 401) {
				return NextResponse.json(
					{ success: false, data: null, message: 'Invalid or expired token' },
					{ status: 401 }
				)
			}
			
			if (backendResponse.status === 403) {
				return NextResponse.json(
					{ success: false, data: null, message: errorData.message || 'Access forbidden' },
					{ status: 403 }
				)
			}
			
			return NextResponse.json(
				{ success: false, data: null, message: errorData.message || 'Request failed' },
				{ status: backendResponse.status }
			)
		}

		const backendData = await backendResponse.json()
		console.log('[Candidates API] Success - found', backendData.pagination?.total_count || 0, 'candidates')
		
		// Transform backend response to frontend format
		interface BackendCandidate {
			applicant_id?: string
			id?: string
			name?: string
			email?: string
			avatar_url?: string
			is_bookmarked?: boolean
			application_id?: string
			application_status?: string
			applied_at?: string
			cover_letter?: string
			resume_url?: string
			updated_at?: string
			created_at?: string
			match_scores?: { overall?: number; skills?: number; experience?: number; education?: number }
			job?: { id: string; title: string; employment_type?: string; experience_level?: string }
			profile?: {
				name?: string
				email?: string
				personal_info?: {
					name?: string
					email?: string
					experience_years?: number
					level?: string
					avatar_url?: string
					available_immediately?: boolean
					job_preferences?: { open_to_remote?: boolean; types?: string[] }
					salary_expectations?: { min?: number; max?: number; currency?: string }
				}
				work_experience?: Array<{ title?: string; location?: string }>
				education?: Array<{ degree?: string; location?: string }>
				about?: string
				skills_expertise?: string[]
			}
		}

		const transformedCandidates = (backendData.candidates || []).map((candidate: BackendCandidate) => ({
			id: candidate.applicant_id || candidate.id || '',
			fullName: candidate.name || candidate.profile?.personal_info?.name || '',
			email: candidate.email || candidate.profile?.personal_info?.email || '',
			currentRole: candidate.profile?.work_experience?.[0]?.title || '',
			headline: candidate.profile?.about || '',
			location: candidate.profile?.work_experience?.[0]?.location || candidate.profile?.education?.[0]?.location || '',
			avatarUrl: candidate.avatar_url || candidate.profile?.personal_info?.avatar_url,
			summary: candidate.profile?.about || '',
			skills: candidate.profile?.skills_expertise || [],
			topSkills: (candidate.profile?.skills_expertise || []).slice(0, 10),
			yearsOfExperience: candidate.profile?.personal_info?.experience_years,
			experienceYears: candidate.profile?.personal_info?.experience_years,
			experienceLevel: candidate.profile?.personal_info?.level?.toLowerCase() || '',
			availability: candidate.profile?.personal_info?.available_immediately ? 'immediate' : undefined,
			openToRemote: candidate.profile?.personal_info?.job_preferences?.open_to_remote || false,
			preferredJobTypes: candidate.profile?.personal_info?.job_preferences?.types || [],
			expectedSalaryMin: candidate.profile?.personal_info?.salary_expectations?.min,
			expectedSalaryMax: candidate.profile?.personal_info?.salary_expectations?.max,
			currency: candidate.profile?.personal_info?.salary_expectations?.currency || 'USD',
			isBookmarked: candidate.is_bookmarked || false,
			matchScores: {
				overallScore: candidate.match_scores?.overall,
				skillsMatch: candidate.match_scores?.skills,
				experienceMatch: candidate.match_scores?.experience,
				educationMatch: candidate.match_scores?.education,
			},
			applications: candidate.job ? [{
				id: candidate.application_id || '',
				jobId: candidate.job.id,
				jobTitle: candidate.job.title,
				status: candidate.application_status || '',
				appliedAt: candidate.applied_at || '',
				matchScores: {
					overallScore: candidate.match_scores?.overall,
					skillsMatch: candidate.match_scores?.skills,
					experienceMatch: candidate.match_scores?.experience,
					educationMatch: candidate.match_scores?.education,
				},
			}] : [],
			degreeSummary: candidate.profile?.education?.[0]?.degree || '',
			educationSummary: candidate.profile?.education?.[0]?.degree || '',
			lastActive: candidate.updated_at || candidate.created_at || new Date().toISOString(),
		}))
		
		const transformedData = {
			candidates: transformedCandidates,
			meta: {
				page: backendData.pagination?.page || 1,
				pageSize: backendData.pagination?.limit || 24,
				totalCount: backendData.pagination?.total_count || 0,
				totalPages: backendData.pagination?.total_pages || 0,
				hasNext: backendData.pagination?.has_next || false,
				hasPrev: backendData.pagination?.has_prev || false,
			}
		}
		
		// Wrap in success envelope to match authenticated-api expectations
		const response = {
			success: true,
			data: transformedData,
			message: 'Candidates retrieved successfully'
		}
		console.log('[Candidates API] Returning success response with', transformedCandidates.length, 'candidates')
		return NextResponse.json(response)
	} catch (error) {
		console.error('[Candidates API] Error:', error)
		return NextResponse.json(
			{ 
				success: false,
				data: null,
				message: 'Internal server error' 
			},
			{ status: 500 }
		)
	}
}
