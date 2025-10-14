'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { 
	Briefcase, 
	MapPin, 
	DollarSign, 
	Clock,
	FileText,
	Tag,
	CheckCircle,
	X,
	Plus,
	AlertCircle
} from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom-select'
import { jobsApi } from '@/lib/jobs-api'

// Validation schema for job posting
const jobPostingSchema = z.object({
	jobTitle: z.string().min(3, 'Job title must be at least 3 characters'),
	officeLocation: z.string().min(2, 'Location is required'),
	isRemote: z.boolean(),
	employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship'], {
		message: 'Please select an employment type'
	}),
	experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead'], {
		message: 'Please select an experience level'
	}),
	minSalary: z.number().min(0, 'Minimum salary must be positive').optional(),
	maxSalary: z.number().min(0, 'Maximum salary must be positive').optional(),
	currency: z.enum(['USD', 'EUR', 'GBP', 'INR']),
	jobDescription: z.string().min(50, 'Description must be at least 50 characters'),
	keyResponsibilities: z.string().min(20, 'Responsibilities must be at least 20 characters'),
	requirementsQualifications: z.string().min(20, 'Requirements must be at least 20 characters'),
	benefitsPerks: z.string().optional(),
	requiredSkills: z.array(z.string()).min(1, 'Add at least one skill'),
	applicationDeadline: z.string().optional(),
	jobStatus: z.enum(['draft', 'published']).optional(),
}).refine((data) => {
	if (data.minSalary && data.maxSalary) {
		return data.maxSalary >= data.minSalary
	}
	return true
}, {
	message: 'Maximum salary must be greater than minimum salary',
	path: ['maxSalary'],
})

type JobPostingForm = z.infer<typeof jobPostingSchema>

export default function PostNewJobPage() {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [currentSkill, setCurrentSkill] = useState('')
	const [skillError, setSkillError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		trigger,
	} = useForm<JobPostingForm>({
		resolver: zodResolver(jobPostingSchema),
		defaultValues: {
			isRemote: false,
			currency: 'USD',
			requiredSkills: [],
			jobStatus: 'draft',
		},
	})

	const skills = watch('requiredSkills') || []
	const isRemote = watch('isRemote')
	const employmentType = watch('employmentType')
	const experienceLevel = watch('experienceLevel')
	const currency = watch('currency')

	const getInputClasses = (hasError: boolean) => {
		const baseClasses = 'w-full rounded-lg border backdrop-blur-sm px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition-all duration-200'
		const normalClasses = 'border-white/30 bg-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/15 focus:border-indigo-500/50'
		const errorClasses = 'border-red-400 bg-red-500/10 focus:ring-2 focus:ring-red-400/50 focus:bg-red-500/15 focus:border-red-400'
		
		return `${baseClasses} ${hasError ? errorClasses : normalClasses}`
	}

	const getTextareaClasses = (hasError: boolean) => {
		const baseClasses = 'w-full rounded-lg border backdrop-blur-sm px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition-all duration-200 resize-none'
		const normalClasses = 'border-white/30 bg-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/15 focus:border-indigo-500/50'
		const errorClasses = 'border-red-400 bg-red-500/10 focus:ring-2 focus:ring-red-400/50 focus:bg-red-500/15 focus:border-red-400'
		
		return `${baseClasses} ${hasError ? errorClasses : normalClasses}`
	}

	const addSkill = () => {
		const trimmedSkill = currentSkill.trim()
		
		if (!trimmedSkill) {
			setSkillError('Skill name cannot be empty')
			return
		}

		if (skills.includes(trimmedSkill)) {
			setSkillError('This skill is already added')
			return
		}

		if (trimmedSkill.length < 2) {
			setSkillError('Skill name must be at least 2 characters')
			return
		}

		setValue('requiredSkills', [...skills, trimmedSkill])
		setCurrentSkill('')
		setSkillError('')
		trigger('requiredSkills')
	}

	const removeSkill = (skillToRemove: string) => {
		setValue('requiredSkills', skills.filter(s => s !== skillToRemove))
		trigger('requiredSkills')
	}

	const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			addSkill()
		}
	}

	const onSubmit = async (data: JobPostingForm) => {
		setIsSubmitting(true)
		try {
			// Use the authenticated API client instead of direct fetch
			const createdJob = await jobsApi.createJob(data)

			if (!createdJob) {
				throw new Error('Failed to create job')
			}

			// Show success message
			setShowSuccess(true)
			
			// Redirect to jobs page after 2 seconds
			setTimeout(() => {
				router.push('/employer/jobs')
			}, 2000)
		} catch (error) {
			console.error('Error posting job:', error)
			const errorMessage = error instanceof Error ? error.message : 'Failed to post job. Please try again.'
			alert(errorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen bg-black relative overflow-hidden">
			{/* Ambient light effects */}
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

			{/* Success Overlay */}
			{showSuccess && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center max-w-md mx-4">
						<CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-white mb-2">
							Job Posted Successfully!
						</h2>
						<p className="text-white/70 mb-4">
							Your job posting is now live. Redirecting to your jobs...
						</p>
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto" />
					</div>
				</div>
			)}

			<div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8">
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
					<h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
						Post a New Job
					</h1>
					<p className="text-white/60 text-sm sm:text-base">
						Fill in the details to create a new job posting
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-6">
						{/* Basic Information */}
						<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6 relative z-10">
							<div className="flex items-center gap-3 mb-6">
								<div className="bg-indigo-500/20 p-2 rounded-lg">
									<Briefcase className="w-5 h-5 text-indigo-400" />
								</div>
								<h2 className="text-xl font-semibold text-white">Basic Information</h2>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-white/90 mb-2">
										Job Title *
									</label>
									<input
										{...register('jobTitle')}
										className={getInputClasses(!!errors.jobTitle)}
										placeholder="e.g. Senior Frontend Developer"
									/>
									{errors.jobTitle && (
										<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.jobTitle.message}
										</p>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											Employment Type *
										</label>
										<CustomSelect
											options={[
												{ value: 'full_time', label: 'Full-time' },
												{ value: 'part_time', label: 'Part-time' },
												{ value: 'contract', label: 'Contract' },
												{ value: 'internship', label: 'Internship' },
											]}
											value={employmentType || ''}
											onChange={(value) => setValue('employmentType', value as JobPostingForm['employmentType'])}
											placeholder="Select employment type"
											error={errors.employmentType?.message}
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											Experience Level *
										</label>
										<CustomSelect
											options={[
												{ value: 'entry', label: 'Entry Level' },
												{ value: 'mid', label: 'Mid Level' },
												{ value: 'senior', label: 'Senior Level' },
												{ value: 'lead', label: 'Lead/Principal' },
											]}
											value={experienceLevel || ''}
											onChange={(value) => setValue('experienceLevel', value as JobPostingForm['experienceLevel'])}
											placeholder="Select experience level"
											error={errors.experienceLevel?.message}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Location */}
						<div className=" rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="bg-emerald-500/20 p-2 rounded-lg">
									<MapPin className="w-5 h-5 text-emerald-400" />
								</div>
								<h2 className="text-xl font-semibold text-white">Location</h2>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-white/90 mb-2">
										Office Location *
									</label>
									<input
										{...register('officeLocation')}
										className={getInputClasses(!!errors.officeLocation)}
										placeholder="e.g. San Francisco, CA"
									/>
									{errors.officeLocation && (
										<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.officeLocation.message}
										</p>
									)}
								</div>

								<label className="flex items-center gap-3 cursor-pointer">
									<input
										type="checkbox"
										{...register('isRemote')}
										className="w-5 h-5 text-indigo-600 bg-white/10 border-white/30 rounded focus:ring-indigo-500"
									/>
									<span className="text-white/90 text-sm">
										This is a remote position
									</span>
								</label>
								{isRemote && (
									<div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
										<p className="text-emerald-300 text-sm">
											✓ This job will be marked as remote-friendly
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Compensation */}
						<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6 relative z-10">
							<div className="flex items-center gap-3 mb-6">
								<div className="bg-green-500/20 p-2 rounded-lg">
									<DollarSign className="w-5 h-5 text-green-400" />
								</div>
								<h2 className="text-xl font-semibold text-white">Compensation</h2>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-white/90 mb-2">
										Currency *
									</label>
									<CustomSelect
										options={[
											{ value: 'USD', label: 'USD - US Dollar' },
											{ value: 'EUR', label: 'EUR - Euro' },
											{ value: 'GBP', label: 'GBP - British Pound' },
											{ value: 'INR', label: 'INR - Indian Rupee' },
										]}
										value={currency}
										onChange={(value) => setValue('currency', value as JobPostingForm['currency'])}
										placeholder="Select currency"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											Minimum Salary
										</label>
										<input
											type="number"
											{...register('minSalary', { valueAsNumber: true })}
											className={getInputClasses(!!errors.minSalary)}
											placeholder="e.g. 80000"
										/>
										{errors.minSalary && (
											<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{errors.minSalary.message}
											</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											Maximum Salary
										</label>
										<input
											type="number"
											{...register('maxSalary', { valueAsNumber: true })}
											className={getInputClasses(!!errors.maxSalary)}
											placeholder="e.g. 120000"
										/>
										{errors.maxSalary && (
											<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{errors.maxSalary.message}
											</p>
										)}
									</div>
								</div>
								<p className="text-white/50 text-xs">
									Leave blank if you prefer not to disclose salary information
								</p>
							</div>
						</div>

						{/* Job Description */}
						<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="bg-blue-500/20 p-2 rounded-lg">
									<FileText className="w-5 h-5 text-blue-400" />
								</div>
								<h2 className="text-xl font-semibold text-white">Job Details</h2>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-white/90 mb-2">
										Job Description *
									</label>
									<textarea
										{...register('jobDescription')}
										rows={5}
										className={getTextareaClasses(!!errors.jobDescription)}
										placeholder="Describe the role and what the candidate will be doing..."
									/>
									{errors.jobDescription && (
										<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.jobDescription.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-white/90 mb-2">
										Key Responsibilities *
									</label>
									<textarea
										{...register('keyResponsibilities')}
										rows={4}
										className={getTextareaClasses(!!errors.keyResponsibilities)}
										placeholder="List the main responsibilities (use bullet points or line breaks)..."
									/>
									{errors.keyResponsibilities && (
										<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.keyResponsibilities.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-white/90 mb-2">
										Requirements & Qualifications *
									</label>
									<textarea
										{...register('requirementsQualifications')}
										rows={4}
										className={getTextareaClasses(!!errors.requirementsQualifications)}
										placeholder="List the required skills, experience, and qualifications..."
									/>
									{errors.requirementsQualifications && (
										<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.requirementsQualifications.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-white/90 mb-2">
										Benefits & Perks
									</label>
									<textarea
										{...register('benefitsPerks')}
										rows={3}
										className={getTextareaClasses(!!errors.benefitsPerks)}
										placeholder="List the benefits, perks, and what makes your company great..."
									/>
									<p className="text-white/50 text-xs mt-1">
										Optional: Highlight what makes your company an attractive place to work
									</p>
								</div>
							</div>
						</div>

						{/* Skills */}
						<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="bg-purple-500/20 p-2 rounded-lg">
									<Tag className="w-5 h-5 text-purple-400" />
								</div>
								<h2 className="text-xl font-semibold text-white">Required Skills *</h2>
							</div>

							<div className="space-y-4">
								<div>
									<div className="flex gap-2">
										<input
											type="text"
											value={currentSkill}
											onChange={(e) => {
												setCurrentSkill(e.target.value)
												setSkillError('')
											}}
											onKeyDown={handleSkillKeyDown}
										className={getInputClasses(!!skillError || !!errors.requiredSkills)}
										placeholder="e.g. React, TypeScript, Node.js..."
										/>
										<button
											type="button"
											onClick={addSkill}
											className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
										>
											<Plus className="w-4 h-4" />
											Add
										</button>
									</div>
									{skillError && (
										<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{skillError}
										</p>
									)}
									{errors.requiredSkills && (
										<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
											<AlertCircle className="w-4 h-4" />
											{errors.requiredSkills.message}
										</p>
									)}
									<p className="text-white/50 text-xs mt-1">
										Press Enter or click Add to add a skill
									</p>
								</div>

								{skills.length > 0 && (
									<div>
										<p className="text-white/70 text-sm mb-2">Added Skills ({skills.length}):</p>
										<div className="flex flex-wrap gap-2">
											{skills.map((skill) => (
												<span
													key={skill}
													className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-sm flex items-center gap-2"
												>
													{skill}
													<button
														type="button"
														onClick={() => removeSkill(skill)}
														className="hover:text-red-400 transition-colors"
													>
														<X className="w-3.5 h-3.5" />
													</button>
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Application Deadline */}
						<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="bg-orange-500/20 p-2 rounded-lg">
									<Clock className="w-5 h-5 text-orange-400" />
								</div>
								<h2 className="text-xl font-semibold text-white">Application Settings</h2>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-white/90 mb-2">
										Application Deadline
									</label>
									<input
										type="date"
										{...register('applicationDeadline')}
										className={getInputClasses(!!errors.applicationDeadline)}
										min={new Date().toISOString().split('T')[0]}
									/>
									<p className="text-white/50 text-xs mt-1">
										Optional: Set a deadline for applications
									</p>
								</div>
							</div>
						</div>

						{/* Submit Buttons */}
						<div className="flex flex-col sm:flex-row gap-3">
							<button
								type="button"
								onClick={() => router.back()}
								className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{isSubmitting ? (
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
										Posting Job...
									</>
								) : (
									<>
										<CheckCircle className="w-5 h-5" />
										Post Job
									</>
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</main>
	)
}
