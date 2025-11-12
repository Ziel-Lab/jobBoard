import { api } from './authenticated-api'
import { getCurrentSubdomain } from './subdomain-utils'
import type {
	CandidateListItem,
	CandidateProfile,
	CandidateListMeta,
	CandidatesListResponse,
	CandidateDetailResponse,
} from '@/types/candidate'

export interface CandidatesApiError {
	message: string
	code?: string
	status?: number
}

export interface CandidatesListQuery {
	page?: number
	limit?: number // Backend uses 'limit' instead of 'pageSize'
	sort_by?: string // e.g. "overall_score", "created_at"
	sort_order?: 'asc' | 'desc'
	search?: string
	min_score?: number
	min_experience?: number
	skills?: string // comma-separated
	job_id?: string
	application_status?: string
	experience_level?: string
	availability?: string
	job_type?: string
	remote_only?: boolean
}

export class CandidatesApiClient {
	/**
	 * Get the current subdomain for API requests
	 */
	private getSubdomain(): string | null {
		return getCurrentSubdomain()
	}

	/**
	 * List candidates with filters and pagination
	 */
	async listCandidates(
		query?: CandidatesListQuery
	): Promise<{
		candidates: CandidateListItem[]
		meta: CandidateListMeta
		error: CandidatesApiError | null
	}> {
		try {
			const subdomain = this.getSubdomain()

			// If no subdomain detected from URL, try to get it from localStorage
			let finalSubdomain = subdomain
			if (!finalSubdomain && typeof window !== 'undefined') {
				try {
					finalSubdomain = localStorage.getItem('subdomain')
				} catch (error) {
					// ignore localStorage errors
				}
			}

			// For localhost development, use a default subdomain if none is found
			if (!finalSubdomain && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
				finalSubdomain = 'symb-technologies' // Default subdomain for localhost development
			}

			console.log('[Candidates API Client] Detected subdomain:', finalSubdomain)

			if (!finalSubdomain) {
				console.error('[Candidates API Client] No subdomain found')
				return {
					candidates: [],
					meta: {
						totalCount: 0,
						page: 1,
						pageSize: 24,
						totalPages: 0,
						hasNext: false,
						hasPrev: false,
					},
					error: {
						message: 'No subdomain found. Please ensure you are on a company subdomain.',
						code: 'NO_SUBDOMAIN',
					},
				}
			}

			// Build query string - convert frontend params to backend format
			const params = new URLSearchParams()
			if (query) {
				// Map page and limit
				if (query.page) params.append('page', String(query.page))
				if (query.limit) params.append('limit', String(query.limit))
				
				// Map sort parameters
				if (query.sort_by) params.append('sort_by', query.sort_by)
				if (query.sort_order) params.append('sort_order', query.sort_order)
				
				// Map filter parameters
				if (query.search) params.append('search', query.search)
				if (query.min_score) params.append('min_score', String(query.min_score))
				if (query.min_experience) params.append('min_experience', String(query.min_experience))
				if (query.skills) params.append('skills', query.skills)
				if (query.job_id && query.job_id !== 'all-jobs') params.append('job_id', query.job_id)
				if (query.application_status && query.application_status !== 'all') params.append('application_status', query.application_status)
				if (query.experience_level && query.experience_level !== 'all') params.append('experience_level', query.experience_level)
				if (query.availability && query.availability !== 'all') params.append('availability', query.availability)
				if (query.job_type && query.job_type !== 'all') params.append('job_type', query.job_type)
				if (query.remote_only) params.append('remote_only', 'true')
			}

			const endpoint = `/api/candidates${params.toString() ? `?${params.toString()}` : ''}`
			console.log('[Candidates API Client] Calling endpoint:', endpoint)
			const response = await api.get<CandidatesListResponse>(endpoint)
			console.log('[Candidates API Client] Response:', { success: response.success, dataExists: !!response.data })

			if (response.success && response.data) {
				return {
					candidates: response.data.candidates || [],
					meta: response.data.meta || {
						totalCount: 0,
						page: 1,
						pageSize: 24,
						totalPages: 0,
						hasNext: false,
						hasPrev: false,
					},
					error: null,
				}
			}

			return {
				candidates: [],
				meta: {
					totalCount: 0,
					page: 1,
					pageSize: 24,
					totalPages: 0,
					hasNext: false,
					hasPrev: false,
				},
				error: {
					message: response.message || 'Failed to list candidates',
					code: 'API_ERROR',
				},
			}
		} catch (error) {
			console.error('[Candidates API] Error listing candidates:', error)
			return {
				candidates: [],
				meta: {
					totalCount: 0,
					page: 1,
					pageSize: 24,
					totalPages: 0,
					hasNext: false,
					hasPrev: false,
				},
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR',
				},
			}
		}
	}

	/**
	 * Get a specific candidate by ID
	 */
	async getCandidate(
		candidateId: string
	): Promise<{ candidate: CandidateProfile | null; error: CandidatesApiError | null }> {
		try {
			if (!candidateId) {
				return {
					candidate: null,
					error: {
						message: 'Candidate ID is required',
						code: 'VALIDATION_ERROR',
					},
				}
			}

			const response = await api.get<CandidateDetailResponse>(`/api/candidates/${candidateId}`)
			if (response.success && response.data) {
				return { candidate: response.data.candidate, error: null }
			}

			return {
				candidate: null,
				error: {
					message: response.message || 'Failed to get candidate',
					code: 'API_ERROR',
				},
			}
		} catch (error) {
			console.error('[Candidates API] Error getting candidate:', error)
			return {
				candidate: null,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR',
				},
			}
		}
	}

	/**
	 * Bookmark/unbookmark a candidate
	 */
	async toggleBookmark(
		candidateId: string,
		isBookmarked: boolean
	): Promise<{ success: boolean; error: CandidatesApiError | null }> {
		try {
			if (!candidateId) {
				return {
					success: false,
					error: {
						message: 'Candidate ID is required',
						code: 'VALIDATION_ERROR',
					},
				}
			}

			const endpoint = isBookmarked
				? `/api/candidates/${candidateId}/bookmark`
				: `/api/candidates/${candidateId}/unbookmark`

			const response = await api.post<void>(endpoint, {})
			if (response.success) {
				return { success: true, error: null }
			}

			return {
				success: false,
				error: {
					message: response.message || 'Failed to update bookmark',
					code: 'API_ERROR',
				},
			}
		} catch (error) {
			console.error('[Candidates API] Error toggling bookmark:', error)
			return {
				success: false,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR',
				},
			}
		}
	}
}

export const candidatesApi = new CandidatesApiClient()

