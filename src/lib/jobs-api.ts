import { api } from './authenticated-api'
import { getCurrentSubdomain } from './subdomain-utils'
import type {
	Job,
	JobCreateInput,
	JobUpdateInput,
	JobsQuery,
	PaginatedJobsResponse,
	JobStatusChangeInput,
} from '@/types/job'

export interface JobsApiError {
	message: string
	code?: string
	status?: number
}

export class JobsApiClient {
	/**
	 * Get the current subdomain for API requests
	 */
	private getSubdomain(): string | null {
		return getCurrentSubdomain()
	}

	/**
	 * Create a new job posting
	 */
	async createJob(data: JobCreateInput): Promise<{ job: Job | null; error: JobsApiError | null }> {
		try {
			const subdomain = this.getSubdomain()
			if (!subdomain) {
				return {
					job: null,
					error: {
						message: 'No subdomain found. Please ensure you are on a company subdomain.',
						code: 'NO_SUBDOMAIN'
					}
				}
			}

			// Validate required fields
			if (!data.jobTitle || !data.jobDescription) {
				return {
					job: null,
					error: {
						message: 'Job title and description are required',
						code: 'VALIDATION_ERROR'
					}
				}
			}

			// Validate application deadline is in the future
			if (data.applicationDeadline) {
				const deadline = new Date(data.applicationDeadline)
				const now = new Date()
				if (deadline <= now) {
					return {
						job: null,
						error: {
							message: 'Application deadline must be today or a future date',
							code: 'INVALID_DEADLINE'
						}
					}
				}
			}

			const response = await api.post<Job>('/api/jobs', {
				...data,
				// Ensure subdomain is included in the request
				subdomain
			} as unknown as Record<string, unknown>)

			if (response.success && response.data) {
				return { job: response.data, error: null }
			}

			return {
				job: null,
				error: {
					message: response.message || 'Failed to create job',
					code: 'API_ERROR'
				}
			}
		} catch (error) {
			console.error('[Jobs API] Error creating job:', error)
			return {
				job: null,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR'
				}
			}
		}
	}

	/**
	 * List all jobs with optional filters
	 */
	async listJobs(query?: JobsQuery): Promise<{ jobs: PaginatedJobsResponse | null; error: JobsApiError | null }> {
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
			
			if (!finalSubdomain) {
				return {
					jobs: null,
					error: {
						message: 'No subdomain found. Please ensure you are on a company subdomain.',
						code: 'NO_SUBDOMAIN'
					}
				}
			}

			// Build query string
			const params = new URLSearchParams()
			if (query) {
				Object.entries(query).forEach(([key, value]) => {
					if (value !== undefined && value !== null && value !== '') {
						params.append(key, String(value))
					}
				})
			}
			
			const endpoint = `/api/jobs${params.toString() ? `?${params.toString()}` : ''}`
			const response = await api.get<PaginatedJobsResponse>(endpoint)
			
			if (response.success && response.data) {
				return { jobs: response.data, error: null }
			}

			return {
				jobs: null,
				error: {
					message: response.message || 'Failed to list jobs',
					code: 'API_ERROR'
				}
			}
		} catch (error) {
			console.error('[Jobs API] Error listing jobs:', error)
			return {
				jobs: null,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR'
				}
			}
		}
	}

	/**
	 * Get a specific job by ID
	 */
	async getJob(jobId: string): Promise<{ job: Job | null; error: JobsApiError | null }> {
		try {
			if (!jobId) {
				return {
					job: null,
					error: {
						message: 'Job ID is required',
						code: 'VALIDATION_ERROR'
					}
				}
			}

			const response = await api.get<Job>(`/api/jobs/${jobId}`)
			if (response.success && response.data) {
				return { job: response.data, error: null }
			}

			return {
				job: null,
				error: {
					message: response.message || 'Failed to get job',
					code: 'API_ERROR'
				}
			}
		} catch (error) {
			console.error('[Jobs API] Error getting job:', error)
			return {
				job: null,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR'
				}
			}
		}
	}

	/**
	 * Update an existing job
	 */
	async updateJob(jobId: string, data: JobUpdateInput): Promise<{ job: Job | null; error: JobsApiError | null }> {
		try {
			if (!jobId) {
				return {
					job: null,
					error: {
						message: 'Job ID is required',
						code: 'VALIDATION_ERROR'
					}
				}
			}

			const response = await api.put<Job>(`/api/jobs/${jobId}`, data as Record<string, unknown>)
			if (response.success && response.data) {
				return { job: response.data, error: null }
			}

			return {
				job: null,
				error: {
					message: response.message || 'Failed to update job',
					code: 'API_ERROR'
				}
			}
		} catch (error) {
			console.error('[Jobs API] Error updating job:', error)
			return {
				job: null,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR'
				}
			}
		}
	}

	/**
	 * Change job status (publish, pause, close, draft)
	 */
	async changeJobStatus(jobId: string, data: JobStatusChangeInput): Promise<{ job: Job | null; error: JobsApiError | null }> {
		try {
			if (!jobId) {
				return {
					job: null,
					error: {
						message: 'Job ID is required',
						code: 'VALIDATION_ERROR'
					}
				}
			}

			if (!data.status) {
				return {
					job: null,
					error: {
						message: 'Status is required',
						code: 'VALIDATION_ERROR'
					}
				}
			}

			const response = await api.patch<Job>(`/api/jobs/${jobId}/status`, data as unknown as Record<string, unknown>)
			if (response.success && response.data) {
				return { job: response.data, error: null }
			}

			return {
				job: null,
				error: {
					message: response.message || 'Failed to change job status',
					code: 'API_ERROR'
				}
			}
		} catch (error) {
			console.error('[Jobs API] Error changing job status:', error)
			return {
				job: null,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR'
				}
			}
		}
	}

	/**
	 * Delete a job
	 */
	async deleteJob(jobId: string): Promise<{ success: boolean; error: JobsApiError | null }> {
		try {
			if (!jobId) {
				return {
					success: false,
					error: {
						message: 'Job ID is required',
						code: 'VALIDATION_ERROR'
					}
				}
			}

			const response = await api.delete<void>(`/api/jobs/${jobId}`)
			if (response.success) {
				return { success: true, error: null }
			}

			return {
				success: false,
				error: {
					message: response.message || 'Failed to delete job',
					code: 'API_ERROR'
				}
			}
		} catch (error) {
			console.error('[Jobs API] Error deleting job:', error)
			return {
				success: false,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'NETWORK_ERROR'
				}
			}
		}
	}
}

export const jobsApi = new JobsApiClient()

