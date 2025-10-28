'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, ChevronRight, Building2, Users, Settings, CheckCircle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom-select'
import { buildSubdomainUrl } from '@/lib/subdomain-utils'

// Validation schemas for each step
const companyDetailsSchema = z.object({
	companyName: z.string().min(2, 'Company name must be at least 2 characters'),
	industry: z.string().min(1, 'Please select an industry'),
	size: z.string().min(1, 'Please select company size'),
	location: z.string().min(2, 'Location must be at least 2 characters'),
	website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
	description: z.string().min(10, 'Description must be at least 10 characters'),
})

const teamSetupSchema = z.object({
	teamMembers: z.array(z.object({
		email: z.string().email('Invalid email address'),
		role: z.string().min(1, 'Please select a role'),
		department: z.string().min(1, 'Please select a department'),
	})).optional(),
})

const preferencesSchema = z.object({
	jobPostingFrequency: z.string().min(1, 'Please select job posting frequency'),
	notificationPreferences: z.object({
		emailNotifications: z.boolean(),
		smsNotifications: z.boolean(),
		marketingEmails: z.boolean(),
	}),
	timezone: z.string().min(1, 'Please select your timezone'),
})

type CompanyDetailsForm = z.infer<typeof companyDetailsSchema>
type TeamSetupForm = z.infer<typeof teamSetupSchema>
type PreferencesForm = z.infer<typeof preferencesSchema>

const steps = [
	{ id: 1, title: 'Company Details', icon: Building2, description: 'Basic company information' },
	{ id: 2, title: 'Team Setup', icon: Users, description: 'Add team members' },
	{ id: 3, title: 'Preferences', icon: Settings, description: 'Configure your preferences' },
]

const industries = [
	'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
	'Retail', 'Real Estate', 'Consulting', 'Media', 'Non-profit', 'Other'
]

const companySizes = [
	'1-10 employees', '11-50 employees', '51-200 employees',
	'201-500 employees', '501-1000 employees', '1000+ employees'
]

const departments = [
	'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Other'
]

const roles = [
	'HR Manager', 'Recruiter', 'Hiring Manager', 'Team Lead', 'Other'
]

const timezones = [
	{ label: 'Pacific Time (US & Canada)', value: 'America/Los_Angeles' },
	{ label: 'Mountain Time (US & Canada)', value: 'America/Denver' },
	{ label: 'Central Time (US & Canada)', value: 'America/Chicago' },
	{ label: 'Eastern Time (US & Canada)', value: 'America/New_York' },
	{ label: 'Atlantic Time (Canada)', value: 'America/Halifax' },
	{ label: 'Buenos Aires', value: 'America/Argentina/Buenos_Aires' },
	{ label: 'Brasilia', value: 'America/Sao_Paulo' },
	{ label: 'London', value: 'Europe/London' },
	{ label: 'Dublin', value: 'Europe/Dublin' },
	{ label: 'Paris, Berlin, Rome', value: 'Europe/Paris' },
	{ label: 'Amsterdam, Brussels', value: 'Europe/Amsterdam' },
	{ label: 'Athens, Helsinki', value: 'Europe/Athens' },
	{ label: 'Moscow, St. Petersburg', value: 'Europe/Moscow' },
	{ label: 'Dubai', value: 'Asia/Dubai' },
	{ label: 'Mumbai, Kolkata, Delhi', value: 'Asia/Kolkata' },
	{ label: 'Bangkok, Hanoi, Jakarta', value: 'Asia/Bangkok' },
	{ label: 'Singapore', value: 'Asia/Singapore' },
	{ label: 'Hong Kong', value: 'Asia/Hong_Kong' },
	{ label: 'Beijing, Shanghai', value: 'Asia/Shanghai' },
	{ label: 'Tokyo, Osaka', value: 'Asia/Tokyo' },
	{ label: 'Seoul', value: 'Asia/Seoul' },
	{ label: 'Sydney, Melbourne', value: 'Australia/Sydney' },
	{ label: 'Auckland, Wellington', value: 'Pacific/Auckland' },
]

function CompanyOnboardingPage() {
	const [currentStep, setCurrentStep] = useState(1)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [completedSteps, setCompletedSteps] = useState<number[]>([])
	const [showSuccess, setShowSuccess] = useState(false)

	// Utility function to generate input classes with error states
	const getInputClasses = (hasError: boolean) => {
		const baseClasses = "w-full rounded-md border backdrop-blur-sm px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
		const normalClasses = "border-white/30 bg-white/15 focus:ring-2 focus:ring-white/50 focus:bg-white/20 focus:border-white/50"
		const errorClasses = "border-red-400 bg-red-500/10 focus:ring-2 focus:ring-red-400/50 focus:bg-red-500/15 focus:border-red-400"
		
		return `${baseClasses} ${hasError ? errorClasses : normalClasses}`
	}

	const getTextareaClasses = (hasError: boolean) => {
		const baseClasses = "w-full rounded-md border backdrop-blur-sm px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
		const normalClasses = "border-white/30 bg-white/15 focus:ring-2 focus:ring-white/50 focus:bg-white/20 focus:border-white/50"
		const errorClasses = "border-red-400 bg-red-500/10 focus:ring-2 focus:ring-red-400/50 focus:bg-red-500/15 focus:border-red-400"
		
		return `${baseClasses} ${hasError ? errorClasses : normalClasses}`
	}

	// Detect user's timezone
	const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

	// Form instances for each step
	const companyForm = useForm<CompanyDetailsForm>({
		resolver: zodResolver(companyDetailsSchema),
		defaultValues: {
			companyName: '',
			industry: '',
			size: '',
			location: '',
			website: '',
			description: '',
		},
	})

	const teamForm = useForm<TeamSetupForm>({
		resolver: zodResolver(teamSetupSchema),
		defaultValues: {
			teamMembers: [],
		},
	})

	const preferencesForm = useForm<PreferencesForm>({
		resolver: zodResolver(preferencesSchema),
		defaultValues: {
			jobPostingFrequency: '',
			notificationPreferences: {
				emailNotifications: true,
				smsNotifications: false,
				marketingEmails: false,
			},
			timezone: detectedTimezone,
		},
	})

	const handleNext = async () => {
		let isValid = false

		if (currentStep === 1) {
			isValid = await companyForm.trigger()
		} else if (currentStep === 2) {
			isValid = await teamForm.trigger()
		} else if (currentStep === 3) {
			isValid = await preferencesForm.trigger()
		}

		if (isValid) {
			setCompletedSteps(prev => [...prev, currentStep])
			setCurrentStep(prev => Math.min(prev + 1, steps.length))
		}
	}

	const handlePrevious = () => {
		setCurrentStep(prev => Math.max(prev - 1, 1))
	}

	const handleSubmit = async () => {
		const isValid = await preferencesForm.trigger()
		if (!isValid) return

		setIsSubmitting(true)
		try {
			const companyData = companyForm.getValues()
			const teamData = teamForm.getValues()
			const preferencesData = preferencesForm.getValues()

			// Do not read tokens from localStorage. Use the same-origin proxy which sends
			// the HttpOnly access cookie with credentials: 'include'.

			// Format data according to API route expectations
			const requestBody = {
				companyData: {
					companyName: companyData.companyName,
					industry: companyData.industry,
					size: companyData.size,
					location: companyData.location,
					website: companyData.website || '',
					description: companyData.description,
				},
				teamData: {
					teamMembers: (teamData.teamMembers || []).map(member => ({
						email: member.email,
						role: member.role,
						department: member.department,
					})),
				},
				preferencesData: {
					timezone: preferencesData.timezone,
					jobPostingFrequency: preferencesData.jobPostingFrequency,
					notificationPreferences: {
						emailNotifications: preferencesData.notificationPreferences.emailNotifications,
						smsNotifications: preferencesData.notificationPreferences.smsNotifications,
						marketingEmails: preferencesData.notificationPreferences.marketingEmails,
					},
				},
			}

			const response = await fetch('/api/company/onboarding', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(requestBody),
			})

			console.log('Response status:', response.status)
			
			let result
			try {
				result = await response.json()
				console.log('Response data:', result)
			} catch (parseError) {
				console.error('Failed to parse response:', parseError)
				throw new Error(`Server returned status ${response.status} but response is not JSON`)
			}

			if (!response.ok) {
				const errorMessage = result.message || result.error || result.detail || 'Failed to complete onboarding'
				throw new Error(`${errorMessage} (Status: ${response.status})`)
			}

			// Show success message briefly before redirecting
			setShowSuccess(true)
			
			// Get subdomain from backend response
			const subdomain = result.subdomain || result.data?.subdomain
			console.log('Onboarding complete. Subdomain:', subdomain)
			
			// Redirect to company subdomain employer dashboard after 2 seconds
			setTimeout(() => {
				if (subdomain) {
				
					const subdomainUrl = buildSubdomainUrl('/employer', subdomain)
					console.log('Redirecting to subdomain:', subdomainUrl)
					window.location.href = subdomainUrl
				} else {
					// Fallback to local /employer if no subdomain provided
					console.warn('No subdomain in response, redirecting to /employer')
					window.location.href = '/employer'
				}
			}, 2000)
		} catch (error) {
			console.error('Error submitting onboarding:', error)
			const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding. Please try again.'
			alert(`Error: ${errorMessage}`)
		} finally {
			setIsSubmitting(false)
		}
	}

	const addTeamMember = () => {
		const currentMembers = teamForm.getValues('teamMembers') || []
		teamForm.setValue('teamMembers', [
			...currentMembers,
			{ email: '', role: '', department: '' }
		])
	}

	const removeTeamMember = (index: number) => {
		const currentMembers = teamForm.getValues('teamMembers') || []
		teamForm.setValue('teamMembers', currentMembers.filter((_, i) => i !== index))
	}

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-white/90 mb-2">
								Company Name *
							</label>
							<input
								{...companyForm.register('companyName')}
								className={getInputClasses(!!companyForm.formState.errors.companyName)}
								placeholder="Enter your company name"
							/>
							{companyForm.formState.errors.companyName && (
								<p className="text-red-400 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
									{companyForm.formState.errors.companyName.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-white/90 mb-2">
									Industry *
								</label>
								<CustomSelect
									options={industries.map(industry => ({ value: industry, label: industry }))}
									value={companyForm.watch('industry')}
									onChange={(value) => companyForm.setValue('industry', value)}
									placeholder="Select industry"
									error={companyForm.formState.errors.industry?.message}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-white/90 mb-2">
									Company Size *
								</label>
								<CustomSelect
									options={companySizes.map(size => ({ value: size, label: size }))}
									value={companyForm.watch('size')}
									onChange={(value) => companyForm.setValue('size', value)}
									placeholder="Select size"
									error={companyForm.formState.errors.size?.message}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-white/90 mb-2">
									Location *
								</label>
								<input
									{...companyForm.register('location')}
									className={getInputClasses(!!companyForm.formState.errors.location)}
									placeholder="City, Country"
								/>
								{companyForm.formState.errors.location && (
									<p className="text-red-400 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
										{companyForm.formState.errors.location.message}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-white/90 mb-2">
									Website/Linkdin
								</label>
								<input
									{...companyForm.register('website')}
									className={getInputClasses(!!companyForm.formState.errors.website)}
									placeholder="https://yourcompany.com"
								/>
								{companyForm.formState.errors.website && (
									<p className="text-red-400 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
										{companyForm.formState.errors.website.message}
									</p>
								)}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-white/90 mb-2">
								Company Description *
							</label>
							<textarea
								{...companyForm.register('description')}
								rows={4}
								className={getTextareaClasses(!!companyForm.formState.errors.description)}
								placeholder="Tell us about your company, its mission, and what makes it unique..."
							/>
							{companyForm.formState.errors.description && (
								<p className="text-red-400 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
									{companyForm.formState.errors.description.message}
								</p>
							)}
						</div>
					</div>
				)

			case 2:
				return (
					<div className="space-y-6">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
							<h3 className="text-base sm:text-lg font-semibold text-white">Team Members</h3>
							<button
								type="button"
								onClick={addTeamMember}
								className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
							>
								Add Member
							</button>
						</div>

						<div className="space-y-4">
							{(teamForm.watch('teamMembers') || []).map((member, index) => (
								<div key={index} className="p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg">
									<div className="flex justify-between items-start mb-4">
										<h4 className="text-white font-medium text-sm sm:text-base">Team Member {index + 1}</h4>
										<button
											type="button"
											onClick={() => removeTeamMember(index)}
											className="text-red-400 hover:text-red-300 text-sm"
										>
											Remove
										</button>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
										<div>
											<label className="block text-sm font-medium text-white/90 mb-2">
												Email *
											</label>
											<input
												{...teamForm.register(`teamMembers.${index}.email`)}
												type="email"
												className={getInputClasses(!!teamForm.formState.errors.teamMembers?.[index]?.email)}
												placeholder="member@company.com"
											/>
											{teamForm.formState.errors.teamMembers?.[index]?.email && (
												<p className="text-red-400 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
													{teamForm.formState.errors.teamMembers[index]?.email?.message}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-white/90 mb-2">
												Role *
											</label>
											<CustomSelect
												options={roles.map(role => ({ value: role, label: role }))}
												value={teamForm.watch(`teamMembers.${index}.role`) || ''}
												onChange={(value) => teamForm.setValue(`teamMembers.${index}.role`, value)}
												placeholder="Select role"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-white/90 mb-2">
												Department *
											</label>
											<CustomSelect
												options={departments.map(dept => ({ value: dept, label: dept }))}
												value={teamForm.watch(`teamMembers.${index}.department`) || ''}
												onChange={(value) => teamForm.setValue(`teamMembers.${index}.department`, value)}
												placeholder="Select department"
											/>
										</div>
									</div>
								</div>
							))}

							{(teamForm.watch('teamMembers') || []).length === 0 && (
								<div className="text-center py-8 text-white/60">
									<Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
									<p>No team members added yet.</p>
									<p className="text-sm">Click &quot;Add Member&quot; to invite your team.</p>
								</div>
							)}
						</div>
					</div>
				)

			case 3:
  return (
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-white/90 mb-2">
								Job Posting Frequency *
							</label>
							<CustomSelect
								options={[
									{ value: 'daily', label: 'Daily' },
									{ value: 'weekly', label: 'Weekly' },
									{ value: 'monthly', label: 'Monthly' },
									{ value: 'as-needed', label: 'As needed' },
								]}
								value={preferencesForm.watch('jobPostingFrequency')}
								onChange={(value) => preferencesForm.setValue('jobPostingFrequency', value)}
								placeholder="Select frequency"
								error={preferencesForm.formState.errors.jobPostingFrequency?.message}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-white/90 mb-2">
								Timezone *
							</label>
							<CustomSelect
								options={timezones.map(tz => ({ value: tz.value, label: tz.label }))}
								value={preferencesForm.watch('timezone')}
								onChange={(value) => preferencesForm.setValue('timezone', value)}
								placeholder="Select your timezone"
								error={preferencesForm.formState.errors.timezone?.message}
							/>
							<p className="text-white/50 text-xs mt-1">
								We&apos;ve auto-detected your timezone. You can change it if needed.
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-white/90 mb-4">
								Notification Preferences
							</label>
							<div className="space-y-3">
								<label className="flex items-center space-x-3">
									<input
										type="checkbox"
										{...preferencesForm.register('notificationPreferences.emailNotifications')}
										className="w-4 h-4 text-indigo-600 bg-white/10 border-white/20 rounded focus:ring-indigo-500"
									/>
									<span className="text-white/90">Email notifications</span>
								</label>

								<label className="flex items-center space-x-3">
									<input
										type="checkbox"
										{...preferencesForm.register('notificationPreferences.smsNotifications')}
										className="w-4 h-4 text-indigo-600 bg-white/10 border-white/20 rounded focus:ring-indigo-500"
									/>
									<span className="text-white/90">SMS notifications</span>
								</label>

								<label className="flex items-center space-x-3">
									<input
										type="checkbox"
										{...preferencesForm.register('notificationPreferences.marketingEmails')}
										className="w-4 h-4 text-indigo-600 bg-white/10 border-white/20 rounded focus:ring-indigo-500"
									/>
									<span className="text-white/90">Marketing emails</span>
								</label>
							</div>
						</div>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<main className="min-h-screen bg-black relative overflow-hidden">
			{/* Ambient light effects */}
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />

			{/* Success Overlay */}
			{showSuccess && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center max-w-md mx-4">
						<CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-white mb-2">
							Onboarding Complete!
						</h2>
						<p className="text-white/70 mb-4">
							Your company profile has been set up successfully. Redirecting to your dashboard...
						</p>
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto" />
					</div>
				</div>
			)}

			<div className="container mx-auto px-4 py-8 relative z-10">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="text-center mb-6 sm:mb-8 px-4 lg:mt-10">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            Let&apos;s set up your company profile to get started
						</h1>
						<br className="hidden sm:block" />
					</div>

					{/* Progress Steps */}
					<div className="mb-8">
						{/* Mobile: Vertical Layout without lines */}
						<div className="flex flex-col lg:hidden items-center gap-6">
							{steps.map((step) => {
								const isCompleted = completedSteps.includes(step.id)
								const isCurrent = currentStep === step.id
								const Icon = step.icon

								return (
									<div key={step.id} className="flex flex-col items-center">
										<div
											className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
												isCompleted
													? 'bg-green-500 border-green-500 text-white'
													: isCurrent
													? 'bg-indigo-500 border-indigo-500 text-white'
													: 'bg-white/10 border-white/20 text-white/50'
											}`}
										>
											{isCompleted ? (
												<CheckCircle className="w-8 h-8" />
											) : (
												<Icon className="lg:w-8 lg:h-8 w-6 h-6" />
											)}
										</div>
										<div className="mt-3 text-center">
											<p className={`text-base font-medium ${
												isCurrent ? 'text-white' : 'text-white/70'
											}`}>
												{step.title}
											</p>
										</div>
									</div>
								)
							})}
						</div>

						{/* Desktop: Horizontal Layout without lines */}
						<div className="hidden lg:flex items-center justify-center w-full max-w-4xl mx-auto gap-8">
							{steps.map((step) => {
								const isCompleted = completedSteps.includes(step.id)
								const isCurrent = currentStep === step.id
								const Icon = step.icon

								return (
									<div key={step.id} className="flex flex-col items-center  min-w-[300px]">
										<div
											className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-colors ${
												isCompleted
													? 'bg-green-500 border-green-500 text-white'
													: isCurrent
													? 'bg-indigo-500 border-indigo-500 text-white'
													: 'bg-white/10 border-white/20 text-white/50'
											}`}
										>
											{isCompleted ? (
												<CheckCircle className="w-7 h-7" />
											) : (
												<Icon className="w-7 h-7" />
											)}
										</div>
										<div className="mt-3 text-center max-w-[140px]">
											<p className={`text-sm font-medium ${
												isCurrent ? 'text-white' : 'text-white/70'
											}`}>
												{step.title}
											</p>
											<p className="text-xs text-white/50 mt-1">
												{step.description}
											</p>
										</div>
									</div>
								)
							})}
						</div>
					</div>

					{/* Form Content */}
					<div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset] relative overflow-hidden">
						{/* Shine effect overlay */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
						<div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
						
						<div className="relative z-10">
							<div className="mb-6">
								<h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
									{steps[currentStep - 1].title}
								</h2>
								<p className="text-sm sm:text-base text-white/70">
									{steps[currentStep - 1].description}
								</p>
							</div>

							{renderStepContent()}

							{/* Navigation */}
							<div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8">
								<button
									type="button"
									onClick={handlePrevious}
									disabled={currentStep === 1}
									className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-2 sm:order-1"
								>
									<ChevronLeft className="w-5 h-5 mr-2" />
									Previous
								</button>

								{currentStep < steps.length ? (
									<button
										type="button"
										onClick={handleNext}
										className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors order-1 sm:order-2"
									>
										Next
										<ChevronRight className="w-5 h-5 ml-2" />
									</button>
								) : (
									<button
										type="button"
										onClick={handleSubmit}
										disabled={isSubmitting}
										className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
									>
										{isSubmitting ? (
											<>
												<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
												Completing...
											</>
										) : (
											<>
												Complete Setup
												<CheckCircle className="w-5 h-5 ml-2" />
											</>
										)}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default CompanyOnboardingPage