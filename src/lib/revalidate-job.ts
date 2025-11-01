/**
 * Triggers on-demand revalidation for a specific job page
 * Call this after updating job status or any job details
 */
export async function revalidateJob(jobId: string, subdomain?: string): Promise<boolean> {
	try {
		const secret = process.env.NEXT_PUBLIC_REVALIDATION_SECRET || 'default-secret-change-in-production'
		
		const response = await fetch('/api/revalidate/job', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${secret}`,
			},
			body: JSON.stringify({ jobId, subdomain }),
		})

		if (!response.ok) {
			console.error('Failed to revalidate job:', await response.text())
			return false
		}

		const data = await response.json()
		console.log('Job revalidated successfully:', data)
		return true
	} catch (error) {
		console.error('Error triggering revalidation:', error)
		return false
	}
}

