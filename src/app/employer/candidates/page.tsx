'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
	Users, 
	Search,
	X,
	MapPin,
	Briefcase,
	Mail,
	Bookmark,
	BookmarkCheck,
	Eye,
	DollarSign,
	Clock
} from 'lucide-react'
import { PortalSelect } from '@/components/ui/portal-select'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { candidatesApi } from '@/lib/candidates-api'
import type { CandidatesListQuery } from '@/lib/candidates-api'
import { jobsApi } from '@/lib/jobs-api'
import type { Job } from '@/types/job'
import type {
	CandidateListItem,
	CandidateListMeta,
	CandidateAvailability,
	CandidateApplicationStatus,
} from '@/types/candidate'

const experienceLevelOptions = [
	{ value: 'all', label: 'All Levels' },
	{ value: 'entry', label: 'Entry Level' },
	{ value: 'mid', label: 'Mid Level' },
	{ value: 'senior', label: 'Senior Level' },
	{ value: 'lead', label: 'Lead/Principal' },
]

const availabilityOptions = [
	{ value: 'all', label: 'All Availability' },
	{ value: 'immediate', label: 'Immediate' },
	{ value: '2-weeks', label: 'Within 2 Weeks' },
	{ value: '1-month', label: 'Within 1 Month' },
	{ value: 'not-looking', label: 'Not Actively Looking' },
]

const jobTypeOptions = [
	{ value: 'all', label: 'All Job Types' },
	{ value: 'full-time', label: 'Full-time' },
	{ value: 'part-time', label: 'Part-time' },
	{ value: 'contract', label: 'Contract' },
	{ value: 'internship', label: 'Internship' },
]

const applicationStatusOptions = [
	{ value: 'all', label: 'All Candidates' },
	{ value: 'pending', label: 'Pending Review' },
	{ value: 'reviewing', label: 'In Review' },
	{ value: 'shortlisted', label: 'Shortlisted' },
	{ value: 'interviewing', label: 'Interviewing' },
	{ value: 'offer', label: 'Offer Extended' },
	{ value: 'rejected', label: 'Rejected' },
	{ value: 'hired', label: 'Hired' },
	{ value: 'withdrawn', label: 'Withdrawn' },
]

export default function BrowseCandidatesPage() {
	const router = useRouter()

	const [candidates, setCandidates] = useState<CandidateListItem[]>([])
	const [meta, setMeta] = useState<CandidateListMeta | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [apiError, setApiError] = useState<string | null>(null)
	const [employerJobs, setEmployerJobs] = useState<Job[]>([])

	const [searchQuery, setSearchQuery] = useState('')
	const [experienceFilter, setExperienceFilter] = useState('all')
	const [availabilityFilter, setAvailabilityFilter] = useState('all')
	const [jobTypeFilter, setJobTypeFilter] = useState('all')
	const [remoteOnlyFilter, setRemoteOnlyFilter] = useState(false)
	const [applicationStatusFilter, setApplicationStatusFilter] = useState('all')
	const [specificJobFilter, setSpecificJobFilter] = useState('all-jobs')
	const [currentPage, setCurrentPage] = useState(1)
	const candidatesPerPage = 24

	// Fetch employer's jobs for the filter dropdown
	useEffect(() => {
		let isActive = true

		const fetchJobs = async () => {
			try {
				const { jobs, error } = await jobsApi.listJobs({
					page: 1,
					pageSize: 100, // Get all jobs for the filter
					sortBy: 'created_at',
					sortOrder: 'desc',
				})
				
				if (isActive) {
					if (error) {
						console.error('Error fetching jobs:', error.message)
					} else if (jobs) {
						setEmployerJobs(jobs.jobs || [])
					}
				}
			} catch (error) {
				console.error('Error fetching jobs:', error)
			}
		}

		void fetchJobs()

		return () => {
			isActive = false
		}
	}, [])

	// Create job filter options from fetched jobs
	const jobFilterOptions = useMemo(() => [
		{ value: 'all-jobs', label: 'All My Jobs' },
		...employerJobs
			.filter(job => job.jobStatus === 'published')
			.map(job => ({ value: job.id, label: job.jobTitle }))
	], [employerJobs])

	// Fetch candidates
	useEffect(() => {
		let isActive = true

		const fetchCandidates = async () => {
			setIsLoading(true)
			setApiError(null)

			const query: CandidatesListQuery = {
				page: currentPage,
				limit: candidatesPerPage,
				sort_by: 'overall_score',
				sort_order: 'desc',
				search: searchQuery || undefined,
				experience_level: experienceFilter !== 'all' ? experienceFilter : undefined,
				availability: availabilityFilter !== 'all' ? availabilityFilter : undefined,
				job_type: jobTypeFilter !== 'all' ? jobTypeFilter : undefined,
				remote_only: remoteOnlyFilter || undefined,
				application_status: applicationStatusFilter !== 'all' ? applicationStatusFilter : undefined,
				job_id: specificJobFilter !== 'all-jobs' ? specificJobFilter : undefined,
			}

			console.log('[Candidates Page] Fetching candidates with query:', query)
			const { candidates: fetchedCandidates, meta: fetchedMeta, error } = await candidatesApi.listCandidates(query)
			console.log('[Candidates Page] API Response:', { 
				candidatesCount: fetchedCandidates.length, 
				meta: fetchedMeta, 
				error 
			})

			if (!isActive) {
				return
			}

			if (error) {
				console.error('[Candidates Page] Error:', error)
				setApiError(error.message)
				setCandidates([])
				setMeta(null)
			} else {
				console.log('[Candidates Page] Setting candidates:', fetchedCandidates.length, 'candidates')
				setCandidates(fetchedCandidates)
				setMeta(fetchedMeta)
				if (fetchedMeta?.page && fetchedMeta.page !== currentPage) {
					setCurrentPage(fetchedMeta.page)
				}
			}

			setIsLoading(false)
		}

		void fetchCandidates()

		return () => {
			isActive = false
		}
	}, [
		currentPage,
		searchQuery,
		experienceFilter,
		availabilityFilter,
		jobTypeFilter,
		remoteOnlyFilter,
		applicationStatusFilter,
		specificJobFilter,
	])

	const totalPages = meta?.totalPages ?? 0
	const totalCount = meta?.totalCount ?? 0
	const currentPageNumber = meta?.page ?? currentPage
	const pageSize = meta?.pageSize ?? candidatesPerPage
	const startIndex = totalCount === 0 ? 0 : (currentPageNumber - 1) * pageSize + 1
	const endIndex = totalCount === 0 ? 0 : Math.min(currentPageNumber * pageSize, totalCount)
	const paginatedCandidates = candidates

	const handleClearFilters = () => {
		setSearchQuery('')
		setExperienceFilter('all')
		setAvailabilityFilter('all')
		setJobTypeFilter('all')
		setRemoteOnlyFilter(false)
		setApplicationStatusFilter('all')
		setSpecificJobFilter('all-jobs')
		setCurrentPage(1)
	}

	const handleSearchChange = (value: string) => {
		setSearchQuery(value)
		setCurrentPage(1)
	}

	const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
		setter(value)
		setCurrentPage(1)
	}

	const toggleBookmark = (candidateId: string) => {
		setCandidates(candidates.map(candidate => 
			candidate.id === candidateId 
				? { ...candidate, isBookmarked: !candidate.isBookmarked }
				: candidate
		))
	}

	const getAvailabilityBadge = (availability?: CandidateAvailability) => {
		if (!availability) {
			return null
		}

		const styles = {
			immediate: 'bg-green-500/20 text-green-300 border-green-500/30',
			'2-weeks': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
			'1-month': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
			'not-looking': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
		}

		const labels = {
			immediate: 'Immediate',
			'2-weeks': '2 Weeks',
			'1-month': '1 Month',
			'not-looking': 'Not Looking',
		}

		return (
			<span className={`px-2 py-1 text-xs font-semibold rounded-full border ${styles[availability]}`}>
				{labels[availability]}
			</span>
		)
	}

	const getInitials = (name?: string) => {
		if (!name) {
			return '??'
		}

		return name
			.trim()
			.split(' ')
			.filter(Boolean)
			.map(n => n[0]?.toUpperCase() ?? '')
			.join('')
			.slice(0, 2) || '??'
	}

	const formatStatusLabel = (status?: CandidateApplicationStatus) => {
		if (!status) {
			return ''
		}

		return status
			.replace(/[-_]/g, ' ')
			.replace(/\b\w/g, char => char.toUpperCase())
	}

	const hasActiveFilters = searchQuery !== '' || experienceFilter !== 'all' || availabilityFilter !== 'all' || jobTypeFilter !== 'all' || remoteOnlyFilter || applicationStatusFilter !== 'all' || specificJobFilter !== 'all-jobs'

	return (
		<main className="min-h-screen bg-black relative overflow-hidden">
			{/* Ambient light effects */}
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

			<div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<button
						onClick={() => router.back()}
						className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
					>
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							width="16" 
							height="16" 
							viewBox="0 0 24 24" 
							fill="none" 
							stroke="currentColor" 
							strokeWidth="2" 
							strokeLinecap="round" 
							strokeLinejoin="round"
						>
							<path d="m15 18-6-6 6-6"/>
						</svg>
						Back
					</button>

					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
								Browse Candidates
							</h1>
							<p className="text-white/60 text-sm sm:text-base">
								Find the perfect match for your job openings
							</p>
						</div>
						<Link
							href="/employer/candidates/saved"
							className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
						>
							<BookmarkCheck className="w-5 h-5" />
							Saved Candidates
						</Link>
					</div>
				</div>

				{/* Filters */}
				<div className="mb-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
					<div className="space-y-4">
						{/* Search */}
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => handleSearchChange(e.target.value)}
								placeholder="Search by name, role, skills, or location..."
								className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/15 focus:border-indigo-500/50 transition-all duration-200"
							/>
						</div>

						{/* Application Filters Section */}
						<div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
							<div className="flex items-center gap-2 mb-3">
								<Briefcase className="w-4 h-4 text-indigo-400" />
								<h3 className="text-sm font-semibold text-indigo-300">Filter by Job Applications</h3>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<PortalSelect
									options={applicationStatusOptions}
									value={applicationStatusFilter}
									onChange={handleFilterChange(setApplicationStatusFilter)}
									placeholder="Application Status"
								/>
								<PortalSelect
									options={jobFilterOptions}
									value={specificJobFilter}
									onChange={handleFilterChange(setSpecificJobFilter)}
									placeholder="Specific Job"
								/>
							</div>
							<p className="text-indigo-300/70 text-xs mt-2">
								View candidates who applied to your jobs or discover new talent
							</p>
						</div>

						{/* General Filter Row */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<PortalSelect
								options={experienceLevelOptions}
								value={experienceFilter}
								onChange={handleFilterChange(setExperienceFilter)}
								placeholder="Experience Level"
							/>
							<PortalSelect
								options={availabilityOptions}
								value={availabilityFilter}
								onChange={handleFilterChange(setAvailabilityFilter)}
								placeholder="Availability"
							/>
							<PortalSelect
								options={jobTypeOptions}
								value={jobTypeFilter}
								onChange={handleFilterChange(setJobTypeFilter)}
								placeholder="Job Type"
							/>
							<label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/30 bg-white/10 cursor-pointer hover:bg-white/15 transition-colors">
								<input
									type="checkbox"
									checked={remoteOnlyFilter}
									onChange={(e) => {
										setRemoteOnlyFilter(e.target.checked)
										setCurrentPage(1)
									}}
									className="w-4 h-4 text-indigo-600 bg-white/10 border-white/30 rounded focus:ring-indigo-500"
								/>
								<span className="text-white/90 text-sm">Remote Only</span>
							</label>
						</div>

						{/* Clear Filters */}
						{hasActiveFilters && (
							<div className="flex justify-end">
								<button
									onClick={handleClearFilters}
									className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 border border-white/20 text-sm"
								>
									<X className="w-4 h-4" />
									Clear All Filters
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Results Count */}
				<div className="mb-4 flex items-center justify-between">
					<p className="text-white/60 text-sm">
						Showing <span className="text-white font-semibold">{totalCount > 0 ? `${startIndex}-${endIndex}` : '0-0'}</span> of <span className="text-white font-semibold">{totalCount}</span> candidate{totalCount !== 1 ? 's' : ''}
					</p>
					{totalPages > 1 && (
						<p className="text-white/60 text-sm">
							Page <span className="text-white font-semibold">{currentPageNumber}</span> of <span className="text-white font-semibold">{totalPages}</span>
						</p>
					)}
				</div>

				{/* Candidates Grid */}
				{isLoading ? (
					<div className="flex items-center justify-center py-16">
						<LoadingSpinner />
					</div>
				) : apiError ? (
					<div className="text-center py-16 rounded-2xl border border-red-500/20 bg-red-500/10 backdrop-blur-xl">
						<h3 className="text-xl font-semibold text-red-400 mb-2">
							Error Loading Candidates
						</h3>
						<p className="text-white/60 mb-6">{apiError}</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
						>
							Try Again
						</button>
					</div>
				) : paginatedCandidates.length > 0 ? (
					<>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{paginatedCandidates.map((candidate) => (
								<div
									key={candidate.id}
									className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
								>
									{/* Header */}
									<div className="flex items-start gap-4 mb-4">
										{/* Avatar */}
										<div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
											<span className="text-indigo-300 font-semibold text-lg">
												{getInitials(candidate.fullName)}
											</span>
										</div>

										{/* Name & Role */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2 mb-1">
												<div className="space-y-1">
													<div className="flex items-center gap-2 flex-wrap">
														<h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
															{candidate.fullName || 'Unnamed Candidate'}
														</h3>
														{candidate.matchScores?.overallScore !== undefined && (
															<span className="px-2 py-0.5 text-xs font-semibold text-indigo-200 bg-indigo-600/20 border border-indigo-600/40 rounded-full">
																{Math.round(candidate.matchScores.overallScore)}% match
															</span>
														)}
													</div>
													<p className="text-white/80 text-sm">
														{candidate.currentRole || candidate.headline || 'Role not specified'}
													</p>
												</div>
												<button
													onClick={() => toggleBookmark(candidate.id)}
													className="text-white/60 hover:text-yellow-400 transition-colors flex-shrink-0"
													aria-label={candidate.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
												>
													{candidate.isBookmarked ? (
														<BookmarkCheck className="w-5 h-5 text-yellow-400 fill-yellow-400" />
													) : (
														<Bookmark className="w-5 h-5" />
													)}
												</button>
											</div>
											<div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
												<span className="flex items-center gap-1">
													<MapPin className="w-3.5 h-3.5" />
													{candidate.location || 'Location not provided'}
												</span>
												{candidate.openToRemote && (
													<span className="px-2 py-0.5 text-xs font-semibold text-emerald-300 bg-emerald-500/20 rounded-full border border-emerald-500/30">
														Open to Remote
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Summary */}
									<p className="text-white/70 text-sm mb-4 line-clamp-2">
										{candidate.summary || 'No summary provided yet.'}
									</p>

									{/* Details Grid */}
									<div className="grid grid-cols-2 gap-3 mb-4 text-xs sm:text-sm">
										<div>
											<p className="text-white/60 mb-1">Experience</p>
											<p className="text-white font-medium">
												{candidate.yearsOfExperience ?? candidate.experienceYears ?? '—'}{(candidate.yearsOfExperience ?? candidate.experienceYears) !== undefined ? ' years' : ''}
											</p>
										</div>
										<div>
											<p className="text-white/60 mb-1">Level</p>
											<p className="text-white font-medium capitalize">
												{candidate.experienceLevel ?? '—'}
											</p>
										</div>
										<div>
											<p className="text-white/60 mb-1">Education</p>
											<p className="text-white font-medium truncate">
												{candidate.degreeSummary || candidate.educationSummary || 'Not specified'}
											</p>
										</div>
										<div>
											<p className="text-white/60 mb-1">Availability</p>
											{getAvailabilityBadge(candidate.availability) ?? (
												<span className="text-white font-medium">—</span>
											)}
										</div>
										<div>
											<p className="text-white/60 mb-1">Overall Match</p>
											<p className="text-white font-medium">
												{candidate.matchScores?.overallScore !== undefined
													? `${Math.round(candidate.matchScores.overallScore)}%`
													: '—'}
											</p>
										</div>
									</div>

									{/* Salary Expectations */}
									{candidate.expectedSalaryMin !== undefined && candidate.expectedSalaryMax !== undefined && (
										<div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
											<p className="text-white/60 text-xs mb-1">Expected Salary</p>
											<p className="text-green-400 font-semibold text-sm flex items-center gap-1">
												<DollarSign className="w-3.5 h-3.5" />
												{candidate.currency ?? 'USD'} {candidate.expectedSalaryMin.toLocaleString()} - {candidate.expectedSalaryMax.toLocaleString()}
											</p>
										</div>
									)}

									{/* Skills */}
									<div className="mb-4">
										<p className="text-white/60 text-xs mb-2">Skills</p>
										<div className="flex flex-wrap gap-1.5">
											{(candidate.topSkills ?? candidate.skills ?? []).slice(0, 6).map((skill) => (
												<span
													key={skill}
													className="px-2 py-1 text-xs font-medium text-white/80 bg-white/10 border border-white/20 rounded-full"
												>
													{skill}
												</span>
											))}
											{(candidate.topSkills ?? candidate.skills ?? []).length > 6 && (
												<span className="px-2 py-1 text-xs font-medium text-white/60 bg-white/5 border border-white/15 rounded-full">
													+{(candidate.topSkills ?? candidate.skills ?? []).length - 6}
												</span>
											)}
											{(candidate.topSkills ?? candidate.skills ?? []).length === 0 && (
												<span className="text-white/50 text-xs">No skills listed</span>
											)}
										</div>
									</div>

									{/* Preferred Job Types */}
									<div className="mb-4">
										<p className="text-white/60 text-xs mb-2">Preferred Job Types</p>
										<div className="flex flex-wrap gap-1.5">
											{candidate.preferredJobTypes?.map((type) => (
												<span
													key={type}
													className="px-2 py-1 text-xs font-medium text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 rounded-full capitalize"
												>
													{type.replace('-', ' ')}
												</span>
											))}
											{!candidate.preferredJobTypes?.length && (
												<span className="text-white/50 text-xs">No preference specified</span>
											)}
										</div>
									</div>

									{/* Applied Jobs */}
									{candidate.applications && candidate.applications.length > 0 && (
										<div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
											<p className="text-indigo-300 text-xs font-semibold mb-2 flex items-center gap-1">
												<Briefcase className="w-3.5 h-3.5" />
												Applied to {candidate.applications.length} of your job
												{candidate.applications.length !== 1 ? 's' : ''}
											</p>
											<div className="flex flex-wrap gap-1.5">
												{candidate.applications.map((application) => (
													<span
														key={application.id}
														className="px-2 py-1 text-xs text-indigo-200 bg-indigo-600/20 border border-indigo-600/30 rounded-full flex items-center gap-1"
													>
														{application.jobTitle}
														{application.status && (
															<span className="text-indigo-200/70">
																• {formatStatusLabel(application.status)}
															</span>
														)}
													</span>
												))}
											</div>
										</div>
									)}

					{/* Last Active */}
					<div className="mb-4 flex items-center gap-2 text-xs text-white/50">
						<Clock className="w-3.5 h-3.5" />
						Last active: {new Date(candidate.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
					</div>

									{/* Actions */}
									<div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
										<Link
											href={`/employer/candidates/${candidate.applications?.[0]?.id || candidate.id}`}
											className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
										>
											<Eye className="w-4 h-4" />
											View Profile
										</Link>
										<button
											onClick={() => alert('Contact feature coming soon')}
											className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
										>
											<Mail className="w-4 h-4" />
											Contact
										</button>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
								{/* Previous Button */}
								<button
									onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
									disabled={currentPage === 1}
									className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 flex items-center gap-2"
								>
									<svg 
										xmlns="http://www.w3.org/2000/svg" 
										width="16" 
										height="16" 
										viewBox="0 0 24 24" 
										fill="none" 
										stroke="currentColor" 
										strokeWidth="2" 
										strokeLinecap="round" 
										strokeLinejoin="round"
									>
										<path d="m15 18-6-6 6-6"/>
									</svg>
									Previous
								</button>

								{/* Page Numbers */}
								<div className="flex items-center gap-2">
									{Array.from({ length: totalPages }, (_, i) => i + 1)
										.filter(page => {
											return page === 1 || 
												page === totalPages || 
												Math.abs(page - currentPage) <= 1
										})
										.map((page, index, array) => {
											const showEllipsisBefore = index > 0 && page - array[index - 1] > 1
											
											return (
												<div key={page} className="flex items-center gap-2">
													{showEllipsisBefore && (
														<span className="text-white/40">...</span>
													)}
													<button
														onClick={() => setCurrentPage(page)}
														className={`w-10 h-10 rounded-lg transition-all duration-200 font-medium ${
															currentPage === page
																? 'bg-indigo-600 text-white'
																: 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
														}`}
													>
														{page}
													</button>
												</div>
											)
										})}
								</div>

								{/* Next Button */}
								<button
									onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
									disabled={currentPage === totalPages}
									className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 flex items-center gap-2"
								>
									Next
									<svg 
										xmlns="http://www.w3.org/2000/svg" 
										width="16" 
										height="16" 
										viewBox="0 0 24 24" 
										fill="none" 
										stroke="currentColor" 
										strokeWidth="2" 
										strokeLinecap="round" 
										strokeLinejoin="round"
									>
										<path d="m9 18 6-6-6-6"/>
									</svg>
								</button>
							</div>
						)}
					</>
				) : (
					<div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
						<Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-white mb-2">
							No candidates found
						</h3>
						<p className="text-white/60 mb-6">
							{hasActiveFilters
								? 'Try adjusting your filters to see more candidates'
								: 'No candidates available at the moment'}
						</p>
						{hasActiveFilters && (
							<button
								onClick={handleClearFilters}
								className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
							>
								<X className="w-5 h-5" />
								Clear All Filters
							</button>
						)}
					</div>
				)}
			</div>
		</main>
	)
}
