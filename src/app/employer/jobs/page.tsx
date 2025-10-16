'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
	Briefcase, 
	Search,
	X,
	Edit,
	Eye,
	Trash2,
	MapPin,
	DollarSign,
	Calendar,
	Plus
} from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom-select'
import { jobsApi } from '@/lib/jobs-api'
import type { Job, JobsQuery } from '@/types/job'

const statusOptions = [
	{ value: 'all', label: 'All Status' },
	{ value: 'published', label: 'Published' },
	{ value: 'draft', label: 'Draft' },
	{ value: 'closed', label: 'Closed' },
	{ value: 'paused', label: 'Paused' },
]

const employmentTypeMap: Record<string, string> = {
	full_time: 'Full-time',
	part_time: 'Part-time',
	contract: 'Contract',
	internship: 'Internship',
}

export default function ManageJobsPage() {
	const router = useRouter()

	const [jobs, setJobs] = useState<Job[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [statusFilter, setStatusFilter] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [jobToDelete, setJobToDelete] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const jobsPerPage = 24

	// Fetch jobs from backend
	useEffect(() => {
		const fetchJobs = async () => {
			setIsLoading(true)
			try {
				const query: JobsQuery = {
					page: currentPage,
					pageSize: jobsPerPage,
					sortBy: 'created_at',
					sortOrder: 'desc',
				}

				if (statusFilter && statusFilter !== 'all') {
					query.jobStatus = statusFilter as Job['jobStatus']
				}

				const response = await jobsApi.listJobs(query)
				if (response) {
					setJobs(response.jobs || [])
				}
			} catch (error) {
				console.error('Error fetching jobs:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchJobs()
	}, [currentPage, statusFilter])

	// Filter jobs based on search (status is already filtered on backend)
	const filteredJobs = jobs.filter(job => {
		if (searchQuery === '') return true
		return job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
			job.officeLocation.toLowerCase().includes(searchQuery.toLowerCase())
	})

	const handleClearFilters = () => {
		setStatusFilter('all')
		setSearchQuery('')
		setCurrentPage(1)
	}

	const handleDeleteJob = (jobId: string) => {
		setJobToDelete(jobId)
		setShowDeleteModal(true)
	}

	const confirmDelete = async () => {
		if (jobToDelete) {
			const success = await jobsApi.deleteJob(jobToDelete)
			if (success) {
				setJobs(jobs.filter(job => job.id !== jobToDelete))
				setShowDeleteModal(false)
				setJobToDelete(null)
			} else {
				alert('Failed to delete job. Please try again.')
			}
		}
	}

	const changeJobStatus = async (jobId: string, newStatus: Job['jobStatus']) => {
		const updatedJob = await jobsApi.changeJobStatus(jobId, { status: newStatus })
		if (updatedJob) {
			setJobs(jobs.map(job => 
				job.id === jobId ? updatedJob : job
			))
		} else {
			alert('Failed to update job status. Please try again.')
		}
	}

	const getStatusBadge = (status: Job['jobStatus']) => {
		const styles = {
			published: 'bg-green-500/20 text-green-300 border-green-500/30',
			draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
			closed: 'bg-red-500/20 text-red-300 border-red-500/30',
			paused: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
		}

		return (
			<span className={`px-2 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
				{status?.charAt(0).toUpperCase() + status?.slice(1)}
			</span>
		)
	}

	const getStatsForStatus = (status: string) => {
		if (status === 'all') return jobs.length
		return jobs.filter(job => job.jobStatus === status).length
	}

	// Pagination calculations
	const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
	const startIndex = (currentPage - 1) * jobsPerPage
	const endIndex = startIndex + jobsPerPage
	const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

	// Reset to page 1 when filters change
	const handleStatusChange = (value: string) => {
		setStatusFilter(value)
		setCurrentPage(1)
	}

	const handleSearchChange = (value: string) => {
		setSearchQuery(value)
		setCurrentPage(1)
	}

	return (
		<main className="min-h-screen bg-black relative overflow-hidden">
			{/* Ambient light effects */}
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
								<Trash2 className="w-6 h-6 text-red-400" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-white">Delete Job</h3>
								<p className="text-white/60 text-sm">This action cannot be undone</p>
							</div>
						</div>
						<p className="text-white/80 mb-6">
							Are you sure you want to delete this job posting? All applicant data will be permanently removed.
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={confirmDelete}
								className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

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
								Manage Jobs
							</h1>
							<p className="text-white/60 text-sm sm:text-base">
								View and manage all your job postings
							</p>
						</div>
						<Link
							href="/employer/jobs/new"
							className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
						>
							<Plus className="w-5 h-5" />
							Post New Job
						</Link>
					</div>
				</div>

				{/* Filters */}
				<div className="mb-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
					<div className="flex flex-col lg:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => handleSearchChange(e.target.value)}
									placeholder="Search by job title or location..."
									className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/15 focus:border-indigo-500/50 transition-all duration-200"
								/>
							</div>
						</div>

						{/* Status Filter */}
						<div className="w-full lg:w-64">
							<CustomSelect
								options={statusOptions}
								value={statusFilter}
								onChange={handleStatusChange}
								placeholder="Filter by status"
							/>
						</div>

						{/* Clear Filters */}
						{(statusFilter !== 'all' || searchQuery !== '') && (
							<button
								onClick={handleClearFilters}
								className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 border border-white/20"
							>
								<X className="w-4 h-4" />
								Clear
							</button>
						)}
					</div>

					{/* Quick Stats */}
					<div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3">
						{statusOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => setStatusFilter(option.value)}
								className={`p-3 rounded-lg transition-all duration-200 ${
									statusFilter === option.value
										? 'bg-indigo-600/30 border-indigo-500/50 border'
										: 'bg-white/5 hover:bg-white/10 border border-white/10'
								}`}
							>
								<p className="text-white/60 text-xs mb-1">{option.label}</p>
								<p className="text-white font-semibold text-lg">
									{getStatsForStatus(option.value)}
								</p>
							</button>
						))}
					</div>
				</div>

				{/* Results Count */}
				<div className="mb-4 flex items-center justify-between">
					<p className="text-white/60 text-sm">
						Showing <span className="text-white font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredJobs.length)}</span> of <span className="text-white font-semibold">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
					</p>
					{totalPages > 1 && (
						<p className="text-white/60 text-sm">
							Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
						</p>
					)}
				</div>

				{/* Jobs Grid */}
				{isLoading ? (
					<div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
						<p className="text-white/60">Loading jobs...</p>
					</div>
				) : filteredJobs.length > 0 ? (
					<>
						<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
							{paginatedJobs.map((job) => (
							<div
								key={job.id}
								className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col"
							>
								{/* Status & Actions Header */}
								<div className="flex items-start justify-between mb-4">
									{getStatusBadge(job.jobStatus)}
								</div>

								{/* Job Title & Location */}
								<div className="mb-4">
									<h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
										{job.jobTitle}
									</h3>
									<div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/60">
										<span className="flex items-center gap-1">
											<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
											<span className="truncate">{job.officeLocation}</span>
										</span>
										{job.isRemote && (
											<span className="px-2 py-0.5 text-xs font-semibold text-emerald-300 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex-shrink-0">
												Remote
											</span>
										)}
									</div>
								</div>

								{/* Job Details */}
								<div className="space-y-1.5 sm:space-y-2 mb-4 flex-1">
									<div className="flex items-center justify-between text-xs sm:text-sm">
										<span className="text-white/60">Type:</span>
										<span className="text-white">{employmentTypeMap[job.employmentType] || job.employmentType}</span>
									</div>
									<div className="flex items-center justify-between text-xs sm:text-sm">
										<span className="text-white/60">Level:</span>
										<span className="text-white capitalize">{job.experienceLevel}</span>
									</div>
									<div className="flex items-center justify-between text-xs sm:text-sm">
										<span className="text-white/60">Salary:</span>
										<span className="text-green-400 font-semibold flex items-center gap-1">
											<DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
											<span className="truncate">
												{job.minSalary && job.maxSalary
													? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`
													: 'Not disclosed'}
											</span>
										</span>
									</div>
									<div className="flex items-center justify-between text-xs sm:text-sm">
										<span className="text-white/60">Posted:</span>
										<span className="text-white/80 flex items-center gap-1">
											<Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
											<span className="hidden xs:inline">
												{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
											</span>
											<span className="xs:hidden">
												{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
											</span>
										</span>
									</div>
								</div>

								{/* Actions */}
								<div className="pt-4 border-t border-white/10 space-y-2">
									<div className="grid grid-cols-2 gap-2">
										{job.jobStatus !== 'draft' ? (
											<Link
												href={`/jobs/${job.id}`}
												target='_blank'
												className={`px-3 py-2 flex items-center justify-center gap-1 rounded-lg transition-colors text-xs sm:text-sm font-medium ${
													job.jobStatus === 'paused'
														? 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-600/30'
														: job.jobStatus === 'closed'
														? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30'
														: 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30'
												}`}
											>
												<Eye className="w-4 h-4" />
												View {job.jobStatus === 'paused' ? '(Paused)' : job.jobStatus === 'closed' ? '(Closed)' : ''}
											</Link>
										) : (
											<button
												disabled
												className="px-3 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1 cursor-not-allowed opacity-50"
											>
												<Eye className="w-4 h-4" />
												Draft
											</button>
										)}
										<Link
											href={`/employer/jobs/${job.id}/edit`}
											className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
										>
											<Edit className="w-4 h-4" />
											Edit
										</Link>
									</div>

									<div className="grid grid-cols-1 gap-2">
										{/* Status change buttons */}
										{job.jobStatus === 'draft' && (
											<button
												onClick={() => changeJobStatus(job.id, 'published')}
												className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 rounded-lg transition-colors text-xs sm:text-sm font-medium"
											>
												Publish
											</button>
										)}
										{job.jobStatus === 'published' && (
											<button
												onClick={() => changeJobStatus(job.id, 'paused')}
												className="px-3 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-600/30 rounded-lg transition-colors text-xs sm:text-sm font-medium"
											>
												Pause
											</button>
										)}
										{job.jobStatus === 'paused' && (
											<button
												onClick={() => changeJobStatus(job.id, 'published')}
												className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 rounded-lg transition-colors text-xs sm:text-sm font-medium"
											>
												Resume
											</button>
										)}
										{(job.jobStatus === 'published' || job.jobStatus === 'paused') && (
											<button
												onClick={() => changeJobStatus(job.id, 'closed')}
												className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors text-xs sm:text-sm font-medium"
											>
												Close
											</button>
										)}
									</div>

									<button
										onClick={() => handleDeleteJob(job.id)}
										className="w-full px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
									>
										<Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										<span className="hidden xs:inline">Delete</span>
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
											// Show first page, last page, current page, and pages around current
											return page === 1 || 
												page === totalPages || 
												Math.abs(page - currentPage) <= 1
										})
										.map((page, index, array) => {
											// Add ellipsis if there's a gap
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
						<Briefcase className="w-16 h-16 text-white/30 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-white mb-2">
							No jobs found
						</h3>
						<p className="text-white/60 mb-6">
							{searchQuery || statusFilter !== 'all'
								? 'Try adjusting your filters'
								: 'Get started by posting your first job'}
						</p>
						{searchQuery || statusFilter !== 'all' ? (
							<button
								onClick={handleClearFilters}
								className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
							>
								<X className="w-5 h-5" />
								Clear Filters
							</button>
						) : (
							<Link
								href="/employer/jobs/new"
								className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
							>
								<Plus className="w-5 h-5" />
								Post Your First Job
							</Link>
						)}
					</div>
				)}
			</div>
		</main>
	)
}
