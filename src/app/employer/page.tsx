import DashboardClient from './dashboard-client'
import type { Job } from '@/types/job'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface DashboardStats {
	totalJobs: number
	activeJobs: number
	totalApplications: number
	newApplications: number
}

async function extractSubdomain(): Promise<string | null> {
    const hdrs = await headers()
    const direct = hdrs.get('X-Company-Subdomain') || hdrs.get('x-company-subdomain')
    if (direct) return direct

    const host = hdrs.get('host') || ''
    const hostname = host.split(':')[0]
    if (hostname.endsWith('.localhost')) {
        return hostname.replace('.localhost', '') || null
    }
    const parts = hostname.split('.')
    if (parts.length > 2 && parts[0] !== 'www') {
        return parts[0]
    }
    return null
}

async function fetchDashboardData() {
    const stats: DashboardStats = {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        newApplications: 0,
    }

    type PublicJobsResponse = {
        jobs: Job[]
        total: number
        page: number
        pageSize: number
        totalPages: number
        company?: unknown
    }

    const params = new URLSearchParams({
        page: '1',
        pageSize: '5',
        sortBy: 'created_at',
        sortOrder: 'desc',
    })

	const subdomain = await extractSubdomain()
	const hdrs = await headers()
	const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || 'localhost:3000'
	const proto = hdrs.get('x-forwarded-proto') || 'http'
	const baseUrl = `${proto}://${host}`

	const res = await fetch(`${baseUrl}/api/jobs/public?${params.toString()}`,
    {
        method: 'GET',
        headers: subdomain ? { 'X-Company-Subdomain': subdomain } : {},
        cache: 'no-store'
    })
    if (!res.ok) {
        return { stats, recentJobs: [] as Job[] }
    }
    const json = (await res.json()) as { success: boolean; data: PublicJobsResponse | null }
    const payload = json?.data
    const recentJobs = payload?.jobs ?? []
    if (payload) {
        stats.totalJobs = payload.total || recentJobs.length
        stats.activeJobs = payload.total || recentJobs.length
    }

    return { stats, recentJobs }
}

export default async function EmployerPage() {
    // Enforce auth + subdomain guard at the page level
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const subdomain = await extractSubdomain()
    if (!accessToken || !subdomain) {
        redirect('/login?redirect=/employer')
    }
	const { stats, recentJobs } = await fetchDashboardData()

	return <DashboardClient stats={stats} recentJobs={recentJobs} />
}

