'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
	Briefcase, 
	TrendingUp, 
	Users, 
	Bell, 
	PlusCircle, 
	FolderOpen, 
	Search, 
	Settings, 
	MapPin,
	DollarSign,
	Clock,
	ChevronRight
} from 'lucide-react'
import SpotlightCard from '@/components/ui/SpotlightCard'
import CountUp from '@/components/ui/CountUp'
import EmployerNavbar from '@/components/ui/employer-navbar'
import type { Job } from '@/types/job'

interface DashboardStats {
	totalJobs: number
	activeJobs: number
	totalApplications: number
	newApplications: number
}

interface DashboardClientProps {
	stats: DashboardStats
	recentJobs: Job[]
}

export default function DashboardClient({ stats, recentJobs }: DashboardClientProps) {
	const [startCounting, setStartCounting] = useState(false)

	// Trigger counting animation when component mounts
	if (!startCounting) {
		setTimeout(() => setStartCounting(true), 100)
	}

	const statCards = [
		{
			title: 'Total Jobs',
			value: stats.totalJobs,
			icon: Briefcase,
			color: 'text-blue-400',
			bgGradient: 'from-blue-500/20 to-blue-600/10',
			iconBg: 'bg-blue-500/20',
		},
		{
			title: 'Active Jobs',
			value: stats.activeJobs,
			icon: TrendingUp,
			color: 'text-emerald-400',
			bgGradient: 'from-emerald-500/20 to-emerald-600/10',
			iconBg: 'bg-emerald-500/20',
		},
		{
			title: 'Total Applications',
			value: stats.totalApplications,
			icon: Users,
			color: 'text-purple-400',
			bgGradient: 'from-purple-500/20 to-purple-600/10',
			iconBg: 'bg-purple-500/20',
		},
		{
			title: 'New Applications',
			value: stats.newApplications,
			icon: Bell,
			color: 'text-orange-400',
			bgGradient: 'from-orange-500/20 to-orange-600/10',
			iconBg: 'bg-orange-500/20',
			badge: 'New',
		},
	]

	const quickActions = [
		{
			title: 'Post New Job',
			description: 'Create a new job posting',
			icon: PlusCircle,
			href: '/employer/jobs/new',
			color: 'text-indigo-400',
			bgColor: 'bg-indigo-500/10',
			hoverColor: 'hover:bg-indigo-500/20',
			borderColor: 'border-indigo-500/30',
		},
		{
			title: 'Manage Jobs',
			description: 'View and edit your postings',
			icon: FolderOpen,
			href: '/employer/jobs',
			color: 'text-cyan-400',
			bgColor: 'bg-cyan-500/10',
			hoverColor: 'hover:bg-cyan-500/20',
			borderColor: 'border-cyan-500/30',
		},
		{
			title: 'Browse Candidates',
			description: 'Find the perfect match',
			icon: Search,
			href: '/employer/candidates',
			color: 'text-green-400',
			bgColor: 'bg-green-500/10',
			hoverColor: 'hover:bg-green-500/20',
			borderColor: 'border-green-500/30',
		},
		{
			title: 'Company Settings',
			description: 'Manage your profile',
			icon: Settings,
			href: '/employer/settings',
			color: 'text-slate-400',
			bgColor: 'bg-slate-500/10',
			hoverColor: 'hover:bg-slate-500/20',
			borderColor: 'border-slate-500/30',
		},
	]

	return (
		<>
			<EmployerNavbar />
			<main className="min-h-screen bg-black relative overflow-hidden">
				{/* Ambient light effects */}
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

				<div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-8 pb-16">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
							Employer Dashboard
						</h1>
						<p className="text-white/60 text-sm sm:text-base">
							Welcome back! Here&apos;s an overview of your recruitment activity.
						</p>
					</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
					{statCards.map((stat) => {
						const Icon = stat.icon
						return (
							<SpotlightCard
								key={stat.title}
								className="!p-0 border-white/10"
								spotlightColor="rgba(255, 255, 255, 0.15)"
							>
								<div className={`relative h-full p-6 bg-gradient-to-br ${stat.bgGradient}`}>
									<div className="flex items-start justify-between mb-4">
										<div className={`${stat.iconBg} p-3 rounded-xl`}>
											<Icon className={`w-6 h-6 ${stat.color}`} />
										</div>
										{stat.badge && (
											<span className="px-2 py-1 text-xs font-semibold text-orange-300 bg-orange-500/20 rounded-full border border-orange-500/30">
												{stat.badge}
											</span>
										)}
									</div>
									<div>
										<h3 className="text-white/70 text-sm font-medium mb-1">
											{stat.title}
										</h3>
										<p className={`text-3xl font-bold ${stat.color}`}>
											<CountUp
												to={stat.value}
												from={0}
												duration={1.5}
												startWhen={startCounting}
											/>
										</p>
									</div>
								</div>
							</SpotlightCard>
						)
					})}
				</div>

				{/* Quick Actions */}
				<div className="mb-8">
					<h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{quickActions.map((action) => {
							const Icon = action.icon
							return (
								<Link key={action.title} href={action.href}>
									<div className={`group relative rounded-2xl border ${action.borderColor} ${action.bgColor} backdrop-blur-xl p-6 transition-all duration-300 ${action.hoverColor} hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] cursor-pointer`}>
										<div className="flex flex-col items-start">
											<div className={`${action.bgColor} p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
												<Icon className={`w-7 h-7 ${action.color}`} />
											</div>
											<h3 className="text-white font-semibold text-lg mb-1">
												{action.title}
											</h3>
											<p className="text-white/60 text-sm">
												{action.description}
											</p>
											<ChevronRight className="absolute top-6 right-6 w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
										</div>
									</div>
								</Link>
							)
						})}
					</div>
				</div>

				{/* Recent Jobs */}
				<div>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl sm:text-2xl font-bold text-white">
							Recent Jobs
						</h2>
						<Link
							href="/employer/jobs"
							className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors"
						>
							View All
							<ChevronRight className="w-4 h-4" />
						</Link>
					</div>
					
					<div className="space-y-4">
						{recentJobs.map((job) => (
							<article
								key={job.id}
								className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
							>
								<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
									{/* Left side - Job info */}
									<div className="flex-1 min-w-0">
										<div className="flex items-start gap-3 mb-3">
											<div className="bg-indigo-500/20 p-2 rounded-lg">
												<Briefcase className="w-5 h-5 text-indigo-400" />
											</div>
											<div className="flex-1">
									<h3 className="text-lg font-semibold text-white mb-1 break-words">
													{job.jobTitle}
												</h3>
												<div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
													<span className="flex items-center gap-1">
														<MapPin className="w-4 h-4" />
														{job.officeLocation}
													</span>
													{job.isRemote && (
														<span className="px-2 py-0.5 text-xs font-semibold text-emerald-300 bg-emerald-500/20 rounded-full border border-emerald-500/30">
															Remote
														</span>
													)}
													<span className="flex items-center gap-1">
														<Clock className="w-4 h-4" />
														{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
													</span>
												</div>
											</div>
										</div>

									<p className="text-white/70 text-sm mb-3 line-clamp-2 break-all overflow-hidden">
											{job?.jobDescription}
										</p>

										<div className="flex flex-wrap gap-2">
											{job?.requiredSkills.slice(0, 5).map((skill) => (
												<span
													key={skill}
													className="px-2.5 py-1 text-xs font-medium text-white/80 bg-white/10 border border-white/20 rounded-full"
												>
													{skill}
												</span>
											))}
											{job.requiredSkills.length > 5 && (
												<span className="px-2.5 py-1 text-xs font-medium text-white/60 bg-white/5 border border-white/15 rounded-full">
													+{job.requiredSkills.length - 5}
												</span>
											)}
										</div>
									</div>

									{/* Right side - Salary & Actions */}
									<div className="flex flex-row lg:flex-col items-start justify-between lg:items-end gap-3 lg:text-right">
										<div>
											<div className="flex items-center gap-1 text-emerald-400 font-semibold text-base mb-1">
												<DollarSign className="w-4 h-4" />
												{job.minSalary
													? `${job.minSalary.toLocaleString()} - ${job.maxSalary?.toLocaleString()}`
													: 'Not disclosed'}
											</div>
											<div className="text-white/50 text-xs capitalize">
												{job.experienceLevel} • {job.employmentType}
											</div>
										</div>
										{/* <Link
											href={`/employer/jobs/${job.id}`}
											className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
										>
											Manage
										</Link> */}
									</div>
								</div>
							</article>
						))}

						{recentJobs.length === 0 && (
							<div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
								<Briefcase className="w-16 h-16 text-white/30 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-white mb-2">
									No jobs posted yet
								</h3>
								<p className="text-white/60 mb-6">
									Get started by posting your first job opening
								</p>
								<Link
									href="/employer/jobs/new"
									className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
								>
									<PlusCircle className="w-5 h-5" />
									Post Your First Job
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
		</>
	)
}
