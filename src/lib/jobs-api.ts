import { api } from './authenticated-api'
import type {
	Job,
	JobCreateInput,
	JobUpdateInput,
	JobsQuery,
	PaginatedJobsResponse,
	JobStatusChangeInput,
} from '@/types/job'

export class JobsApiClient {
	/**
	 * Create a new job posting
	 */
	async createJob(data: JobCreateInput): Promise<Job | null> {
		try {
			const response = await api.post<Job>('/api/jobs', data as unknown as Record<string, unknown>)
			if (response.success && response.data) {
				return response.data
			}
			console.error('[Jobs API] Failed to create job:', response.message)
			return null
		} catch (error) {
			console.error('[Jobs API] Error creating job:', error)
			return null
		}
	}

	/**
	 * List all jobs with optional filters
	 */
	async listJobs(query?: JobsQuery): Promise<PaginatedJobsResponse | null> {
		try {
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
				return response.data
			}
			console.error('[Jobs API] Failed to list jobs:', response.message)
			return null
		} catch (error) {
			console.error('[Jobs API] Error listing jobs:', error)
			return null
		}
	}

	/**
	 * Get a specific job by ID
	 */
	async getJob(jobId: string): Promise<Job | null> {
		try {
			const response = await api.get<Job>(`/api/jobs/${jobId}`)
			if (response.success && response.data) {
				return response.data
			}
			console.error('[Jobs API] Failed to get job:', response.message)
			return null
		} catch (error) {
			console.error('[Jobs API] Error getting job:', error)
			return null
		}
	}

	/**
	 * Update an existing job
	 */
	async updateJob(jobId: string, data: JobUpdateInput): Promise<Job | null> {
		try {
			const response = await api.put<Job>(`/api/jobs/${jobId}`, data as Record<string, unknown>)
			if (response.success && response.data) {
				return response.data
			}
			console.error('[Jobs API] Failed to update job:', response.message)
			return null
		} catch (error) {
			console.error('[Jobs API] Error updating job:', error)
			return null
		}
	}

	/**
	 * Change job status (publish, pause, close, draft)
	 */
	async changeJobStatus(jobId: string, data: JobStatusChangeInput): Promise<Job | null> {
		try {
			const response = await api.patch<Job>(`/api/jobs/${jobId}/status`, data as unknown as Record<string, unknown>)
			if (response.success && response.data) {
				return response.data
			}
			console.error('[Jobs API] Failed to change job status:', response.message)
			return null
		} catch (error) {
			console.error('[Jobs API] Error changing job status:', error)
			return null
		}
	}

	/**
	 * Delete a job
	 */
	async deleteJob(jobId: string): Promise<boolean> {
		try {
			const response = await api.delete<void>(`/api/jobs/${jobId}`)
			return response.success
		} catch (error) {
			console.error('[Jobs API] Error deleting job:', error)
			return false
		}
	}
}

export const jobsApi = new JobsApiClient()

