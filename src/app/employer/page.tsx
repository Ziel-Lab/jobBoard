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
			title: 'Senior Frontend Developer',
			company: 'TechCorp Inc.',
			location: 'San Francisco, CA',
			isRemote: true,
			salaryMin: 120000,
			salaryMax: 180000,
			currency: 'USD',
			description: 'We are looking for an experienced frontend developer to join our team...',
			skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
			experienceLevel: 'senior',
			employmentType: 'full-time',
			postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			applyUrl: '/jobs/1',
		},
		{
			id: '2',
			title: 'Backend Engineer',
			company: 'TechCorp Inc.',
			location: 'New York, NY',
			isRemote: false,
			salaryMin: 100000,
			salaryMax: 150000,
			currency: 'USD',
			description: 'Join our backend team to build scalable microservices...',
			skills: ['Node.js', 'Python', 'AWS', 'Docker'],
			experienceLevel: 'mid',
			employmentType: 'full-time',
			postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
			applyUrl: '/jobs/2',
		},
		{
			id: '3',
			title: 'Product Designer',
			company: 'TechCorp Inc.',
			location: 'Remote',
			isRemote: true,
			salaryMin: 90000,
			salaryMax: 130000,
			currency: 'USD',
			description: 'We need a creative product designer to craft beautiful user experiences...',
			skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
			experienceLevel: 'mid',
			employmentType: 'full-time',
			postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
			applyUrl: '/jobs/3',
		},
	]

	return { stats, recentJobs }
}

export default async function EmployerPage() {
	const { stats, recentJobs } = await fetchDashboardData()

	return <DashboardClient stats={stats} recentJobs={recentJobs} />
}

