import DashboardClient from './dashboard-client'
import type { Job } from '@/types/job'

export const dynamic = 'force-dynamic'

interface DashboardStats {
	totalJobs: number
	activeJobs: number
	totalApplications: number
	newApplications: number
}

async function fetchDashboardData() {
	// In a real app, these would be actual API calls
	// For now, we'll return mock data
	const stats: DashboardStats = {
		totalJobs: 24,
		activeJobs: 18,
		totalApplications: 342,
		newApplications: 28,
	}

	const recentJobs: Job[] = [
		{
			id: '1',
			jobTitle: 'Senior Frontend Developer',
			company: 'TechCorp Inc.',
			officeLocation: 'San Francisco, CA',
			isRemote: true,
			minSalary: 120000,
			maxSalary: 180000,
			currency: 'USD',
			jobDescription: 'We are looking for an experienced frontend developer to join our team...',
			keyResponsibilities: '• Build responsive web applications\n• Collaborate with design team\n• Mentor junior developers',
			requirementsQualifications: '• 5+ years React experience\n• Strong TypeScript skills\n• Experience with Next.js',
			benefitsPerks: '• Competitive salary\n• Health insurance\n• Remote work options',
			requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
			experienceLevel: 'senior',
			employmentType: 'full_time',
			jobStatus: 'published',
			createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			companyId: 'company-1',
		}
	]

	return { stats, recentJobs }
}

export default async function EmployerPage() {
	const { stats, recentJobs } = await fetchDashboardData()

	return <DashboardClient stats={stats} recentJobs={recentJobs} />
}

