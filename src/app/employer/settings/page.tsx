'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { 
	Building2, 
	Palette, 
	Globe, 
	Users,
	Mail,
	Trash2,
	Plus,
	Upload,
	X,
	Save,
	AlertCircle,
	CheckCircle,
	UserPlus,
	MapPin,
	Clock
} from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom-select'
import Image from 'next/image'
import { api } from '@/lib/authenticated-api'
import { IoArrowBackOutline } from "react-icons/io5";
import EmployerNavbar from '@/components/ui/employer-navbar'
import { LocationAutocomplete } from '@/components/jobs/location-autocomplete'

// Validation schema for company settings
const companySettingsSchema = z.object({
	subdomain: z.string().min(3, 'Subdomain must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
	companyName: z.string().min(2, 'Company name must be at least 2 characters'),
	website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
	industry: z.string().min(1, 'Please select an industry'),
	companySize: z.string().min(1, 'Please select company size'),
	location: z.string().min(2, 'Location must be at least 2 characters'),
	description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description must be less than 500 characters'),
	timezone: z.string().min(1, 'Please select a timezone'),
	primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
	secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
	logoUrl: z.string().optional(),
})

type CompanySettingsForm = z.infer<typeof companySettingsSchema>

interface CompanyProfile {
	id: string
	subdomain: string
	companyName: string
	logoUrl?: string
	website?: string
	industry: string
	companySize: string
	location: string
	description: string
	branding: {
		primaryColor: string
		secondaryColor: string
	}
	settings: {
		timezone: string
		jobPostingFrequency?: string
	}
	isActive: boolean
	isVerified: boolean
	subscriptionTier: string
	subscriptionStatus: string
	createdAt: string
	updatedAt: string
}

interface TeamMember {
	id: string
	name: string
	email: string
	role: string
	department: string
	status: 'active' | 'pending'
	joinedAt: string
}

const departments = [
	'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Other'
]

const roles = [
	'HR Manager', 'Recruiter', 'Hiring Manager', 'Team Lead', 'Admin', 'Other'
]

const industries = [
	'Technology',
	'Healthcare',
	'Finance',
	'Education',
	'Retail',
	'Manufacturing',
	'Real Estate',
	'Consulting',
	'Media & Entertainment',
	'Hospitality',
	'Transportation',
	'Energy',
	'Other'
]

const companySizes = [
	'1-10 employees',
	'11-50 employees',
	'51-200 employees',
	'201-500 employees',
	'501-1000 employees',
	'1000+ employees'
]

const timezones = [
	'America/New_York',
	'America/Chicago',
	'America/Denver',
	'America/Los_Angeles',
	'America/Anchorage',
	'Pacific/Honolulu',
	'Europe/London',
	'Europe/Paris',
	'Europe/Berlin',
	'Asia/Tokyo',
	'Asia/Shanghai',
	'Asia/Dubai',
	'Australia/Sydney',
	'UTC'
]

function CompanySettingsPage() {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [showSuccess, setShowSuccess] = useState(false)
	const [logoPreview, setLogoPreview] = useState<string>('')
	const [activeTab, setActiveTab] = useState<'general' | 'team'>('general')
	const [logoFile, setLogoFile] = useState<File | null>(null)
	const [fetchError, setFetchError] = useState<string>('')
	const [originalData, setOriginalData] = useState<CompanySettingsForm | null>(null)

	// Mock team members data
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
		{
			id: '1',
			name: 'John Doe',
			email: 'john@company.com',
			role: 'HR Manager',
			department: 'HR',
			status: 'active',
			joinedAt: '2024-01-15',
		},
		{
			id: '3',
			name: 'Bob Wilson',
			email: 'bob@company.com',
			role: 'Team Lead',
			department: 'Engineering',
			status: 'pending',
			joinedAt: '2024-03-10',
		},
	])

	// Invite modal state
	const [showInviteModal, setShowInviteModal] = useState(false)
	const [inviteEmail, setInviteEmail] = useState('')
	const [inviteRole, setInviteRole] = useState('')
	const [inviteDepartment, setInviteDepartment] = useState('')
	const [inviteError, setInviteError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
		trigger,
	} = useForm<CompanySettingsForm>({
		resolver: zodResolver(companySettingsSchema),
	})

	const primaryColor = watch('primaryColor')
	const secondaryColor = watch('secondaryColor')

	// Fetch company profile on component mount
	useEffect(() => {
		const fetchCompanyProfile = async () => {
			try {
				setIsLoading(true)
				setFetchError('')
				
				const result = await api.get<CompanyProfile>('/api/company/profile')
				const profile = result.data
				const formData: CompanySettingsForm = {
					subdomain: profile.subdomain || '',
					companyName: profile.companyName || '',
					website: profile.website || '',
					industry: profile.industry || '',
					companySize: profile.companySize || '',
					location: profile.location || '',
					description: profile.description || '',
					timezone: profile.settings?.timezone || '',
					primaryColor: profile.branding?.primaryColor || '#6366F1',
					secondaryColor: profile.branding?.secondaryColor || '#10B981',
					logoUrl: profile.logoUrl || '',
				}
				
				reset(formData)
				// Store original data for change detection
				setOriginalData(formData)

				// Set logo preview if exists
				if (profile.logoUrl) {
					setLogoPreview(profile.logoUrl)
				}
			} catch (error) {
				console.error('Error fetching company profile:', error)
				setFetchError(error instanceof Error ? error.message : 'Failed to load company settings')
			} finally {
				setIsLoading(false)
			}
		}

		fetchCompanyProfile()
	}, [reset])

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

	const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			// Validate file type
			const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
			if (!allowedTypes.includes(file.type)) {
				alert('Please upload a PNG, JPG, or SVG image')
				return
			}
			
			// Validate file size (max 2MB)
			if (file.size > 2 * 1024 * 1024) {
				alert('File size must be less than 2MB')
				return
			}

			// Store the file for upload
			setLogoFile(file)

			// Create preview
			const reader = new FileReader()
			reader.onloadend = () => {
				setLogoPreview(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const removeLogo = () => {
		setLogoPreview('')
		setLogoFile(null)
		setValue('logoUrl', '')
	}

	const handleInviteMember = () => {
		setInviteError('')

		if (!inviteEmail || !inviteRole || !inviteDepartment) {
			setInviteError('All fields are required')
			return
		}

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(inviteEmail)) {
			setInviteError('Invalid email address')
			return
		}

		// Check if email already exists
		if (teamMembers.some(member => member.email === inviteEmail)) {
			setInviteError('This email is already added')
			return
		}

		// Add new member with pending status
		const newMember: TeamMember = {
			id: Date.now().toString(),
			name: inviteEmail.split('@')[0],
			email: inviteEmail,
			role: inviteRole,
			department: inviteDepartment,
			status: 'pending',
			joinedAt: new Date().toISOString(),
		}

		setTeamMembers([...teamMembers, newMember])
		
		// Reset form
		setInviteEmail('')
		setInviteRole('')
		setInviteDepartment('')
		setShowInviteModal(false)
	}

	const removeMember = (memberId: string) => {
		if (confirm('Are you sure you want to remove this team member?')) {
			setTeamMembers(teamMembers.filter(member => member.id !== memberId))
		}
	}

	const resendInvitation = (memberEmail: string) => {
		alert(`Invitation resent to ${memberEmail}`)
	}

	const onSubmit = async (data: CompanySettingsForm) => {
		setIsSubmitting(true)
		try {
			let logoUrl = data.logoUrl

			// Step 1: Upload logo if a new file was selected
			if (logoFile) {
				const formData = new FormData()
				formData.append('file', logoFile)

				interface LogoUploadResponse {
					logoUrl?: string
					url?: string
				}
				const logoResult = await api.uploadFile<LogoUploadResponse>('/api/company/upload-logo', logoFile)
				logoUrl = logoResult.data?.logoUrl || logoResult.data?.url
			}

			// Step 2: Build update payload with only changed fields
			const profileData: Partial<{
				subdomain: string
				companyName: string
				website: string
				industry: string
				companySize: string
				location: string
				description: string
				branding: { primaryColor: string; secondaryColor: string }
				settings: { timezone: string }
				logoUrl: string
			}> = {}

			if (!originalData) {
				throw new Error('Original data not loaded')
			}

			// Check each field for changes
			if (data.subdomain !== originalData.subdomain) {
				profileData.subdomain = data.subdomain
			}
			if (data.companyName !== originalData.companyName) {
				profileData.companyName = data.companyName
			}
			if (data.website !== originalData.website) {
				profileData.website = data.website
			}
			if (data.industry !== originalData.industry) {
				profileData.industry = data.industry
			}
			if (data.companySize !== originalData.companySize) {
				profileData.companySize = data.companySize
			}
			if (data.location !== originalData.location) {
				profileData.location = data.location
			}
			if (data.description !== originalData.description) {
				profileData.description = data.description
			}

			// Check branding colors
			const brandingChanged = 
				data.primaryColor !== originalData.primaryColor ||
				data.secondaryColor !== originalData.secondaryColor

			if (brandingChanged) {
				profileData.branding = {
					primaryColor: data.primaryColor,
					secondaryColor: data.secondaryColor,
				}
			}

			// Check timezone
			if (data.timezone !== originalData.timezone) {
				profileData.settings = {
					timezone: data.timezone,
				}
			}

			// Add logo if it was uploaded
			if (logoFile && logoUrl) {
				profileData.logoUrl = logoUrl
			}

			// Only send request if there are changes
			if (Object.keys(profileData).length === 0) {
				alert('No changes to save')
				return
			}

			console.log('Sending update with changes:', profileData)

			await api.put('/api/company/profile', profileData)

			// Update original data with new values
			setOriginalData({ ...originalData, ...data })
			
			// Clear logo file after successful save
			setLogoFile(null)

			// Show success message
			setShowSuccess(true)
			
			setTimeout(() => {
				setShowSuccess(false)
			}, 3000)
		} catch (error) {
			console.error('Error updating settings:', error)
			alert(error instanceof Error ? error.message : 'Failed to update settings. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen bg-black relative overflow-hidden">
			{/* Ambient light effects */}
			<EmployerNavbar />
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

			{/* Success Notification */}
			{showSuccess && (
				<div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
					<div className="bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-lg p-4 flex items-center gap-3 shadow-lg">
						<CheckCircle className="w-5 h-5 text-green-400" />
						<p className="text-white font-medium">Settings updated successfully!</p>
					</div>
				</div>
			)}

			{/* Invite Modal */}
			{showInviteModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-semibold text-white flex items-center gap-2">
								<UserPlus className="w-5 h-5" />
								Invite Team Member
							</h3>
							<button
								onClick={() => setShowInviteModal(false)}
								className="text-white/60 hover:text-white transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-white/90 mb-2">
									Email Address *
								</label>
								<input
									type="email"
									value={inviteEmail}
									onChange={(e) => setInviteEmail(e.target.value)}
									className={getInputClasses(false)}
									placeholder="member@company.com"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-white/90 mb-2">
									Role *
								</label>
								<CustomSelect
									options={roles.map(role => ({ value: role, label: role }))}
									value={inviteRole}
									onChange={setInviteRole}
									placeholder="Select role"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-white/90 mb-2">
									Department *
								</label>
								<CustomSelect
									options={departments.map(dept => ({ value: dept, label: dept }))}
									value={inviteDepartment}
									onChange={setInviteDepartment}
									placeholder="Select department"
								/>
							</div>

							{inviteError && (
								<p className="text-red-400 text-sm flex items-center gap-1">
									<AlertCircle className="w-4 h-4" />
									{inviteError}
								</p>
							)}

							<div className="flex gap-3 pt-2">
								<button
									onClick={() => setShowInviteModal(false)}
									className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={handleInviteMember}
									className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
								>
									Send Invitation
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<button
						onClick={() => router.back()}
						className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
					>   
						<IoArrowBackOutline className="w-4 h-4" />
						Back
					</button>
					<h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
						Company Settings
					</h1>
					<p className="text-white/60 text-sm sm:text-base">
						Manage your company profile and team members
					</p>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
							<p className="text-white/60">Loading company settings...</p>
						</div>
					</div>
				)}

				{/* Error State */}
				{fetchError && !isLoading && (
					<div className="rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-6 mb-6">
						<div className="flex items-center gap-3 text-red-400">
							<AlertCircle className="w-5 h-5" />
							<div>
								<h3 className="font-semibold mb-1">Failed to load settings</h3>
								<p className="text-sm">{fetchError}</p>
							</div>
						</div>
						<button
							onClick={() => window.location.reload()}
							className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
						>
							Retry
						</button>
					</div>
				)}

				{/* Main Content - Only show when not loading and no error */}
				{!isLoading && !fetchError && (
					<>

				{/* Tabs */}
				<div className="flex gap-2 mb-6 border-b border-white/10">
					<button
						onClick={() => setActiveTab('general')}
						className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
							activeTab === 'general'
								? 'border-indigo-500 text-white'
								: 'border-transparent text-white/60 hover:text-white'
						}`}
					>
						<span className="flex items-center gap-2">
							<Building2 className="w-4 h-4" />
							General
						</span>
					</button>
					<button
						onClick={() => setActiveTab('team')}
						className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
							activeTab === 'team'
								? 'border-indigo-500 text-white'
								: 'border-transparent text-white/60 hover:text-white'
						}`}
					>
						<span className="flex items-center gap-2">
							<Users className="w-4 h-4" />
							Team Members
						</span>
					</button>
				</div>

				{/* General Settings Tab */}
				{activeTab === 'general' && (
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-6">
							{/* Company Information */}
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6 relative z-10">
								<div className="flex items-center gap-3 mb-6">
									<div className="bg-indigo-500/20 p-2 rounded-lg">
										<Building2 className="w-5 h-5 text-indigo-400" />
									</div>
									<h2 className="text-xl font-semibold text-white">Company Information</h2>
								</div>

								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-white/90 mb-2">
												Company Name *
											</label>
											<input
												{...register('companyName')}
												className={getInputClasses(!!errors.companyName)}
												placeholder="Enter company name"
											/>
											{errors.companyName && (
												<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
													<AlertCircle className="w-4 h-4" />
													{errors.companyName.message}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-white/90 mb-2">
												Subdomain *
											</label>
											<input
												{...register('subdomain')}
												className={getInputClasses(!!errors.subdomain)}
												placeholder="your-company-name"
											/>
											{errors.subdomain && (
												<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
													<AlertCircle className="w-4 h-4" />
													{errors.subdomain.message}
												</p>
											)}
											<p className="text-white/50 text-xs mt-1">
												Your company page will be at: {watch('subdomain') || 'subdomain'}.yourdomain.com
											</p>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-white/90 mb-2">
												Industry *
											</label>
											<CustomSelect
												options={industries.map(ind => ({ value: ind, label: ind }))}
												value={watch('industry') || ''}
												onChange={(value) => setValue('industry', value)}
												placeholder="Select industry"
											/>
											{errors.industry && (
												<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
													<AlertCircle className="w-4 h-4" />
													{errors.industry.message}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-white/90 mb-2">
												Company Size *
											</label>
											<CustomSelect
												options={companySizes.map(size => ({ value: size, label: size }))}
												value={watch('companySize') || ''}
												onChange={(value) => setValue('companySize', value)}
												placeholder="Select company size"
											/>
											{errors.companySize && (
												<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
													<AlertCircle className="w-4 h-4" />
													{errors.companySize.message}
												</p>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="relative z-[9998]">
											<label className="block text-sm font-medium text-white/90 mb-2">
												<span className="flex items-center gap-2">
													<MapPin className="w-4 h-4" />
													Location *
												</span>
											</label>
											<LocationAutocomplete
												value={watch('location') || ''}
												onChange={(value) => {
													setValue('location', value)
													trigger('location')
												}}
												placeholder="e.g., Remote, San Francisco, CA"
												error={errors.location?.message}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-white/90 mb-2">
												<span className="flex items-center gap-2">
													<Clock className="w-4 h-4" />
													Timezone *
												</span>
											</label>
											<CustomSelect
												options={timezones.map(tz => ({ value: tz, label: tz.replace(/_/g, ' ') }))}
												value={watch('timezone') || ''}
												onChange={(value) => setValue('timezone', value)}
												placeholder="Select timezone"
											/>
											{errors.timezone && (
												<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
													<AlertCircle className="w-4 h-4" />
													{errors.timezone.message}
												</p>
											)}
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											<span className="flex items-center gap-2">
												<Globe className="w-4 h-4" />
												Website
											</span>
										</label>
										<input
											{...register('website')}
											className={getInputClasses(!!errors.website)}
											placeholder="https://yourcompany.com"
										/>
										{errors.website && (
											<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{errors.website.message}
											</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											Company Description *
										</label>
										<textarea
											{...register('description')}
											rows={4}
											className={getTextareaClasses(!!errors.description)}
											placeholder="Tell us about your company..."
										/>
										{errors.description && (
											<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{errors.description.message}
											</p>
										)}
										<p className="text-white/50 text-xs mt-1">
											{watch('description')?.length || 0} / 500 characters
										</p>
									</div>
								</div>
							</div>

							{/* Company Logo */}
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
								<div className="flex items-center gap-3 mb-6">
									<div className="bg-purple-500/20 p-2 rounded-lg">
										<Upload className="w-5 h-5 text-purple-400" />
									</div>
									<h2 className="text-xl font-semibold text-white">Company Logo</h2>
								</div>

								<div className="space-y-4">
									{logoPreview ? (
										<div className="flex items-center gap-4">
											<div className="relative w-32 h-32 rounded-lg border border-white/20 bg-white/5 p-2">
												<Image
													src={logoPreview}
													alt="Company logo"
													width={128}
													height={128}
													className="w-full h-full object-contain rounded"
												/>
											</div>
											<div className="flex-1">
												<p className="text-white/90 text-sm mb-2">
													{logoFile ? 'New logo selected (will be uploaded on save)' : 'Current company logo'}
												</p>
												<button
													type="button"
													onClick={removeLogo}
													className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors text-sm flex items-center gap-2"
												>
													<Trash2 className="w-4 h-4" />
													Remove Logo
												</button>
											</div>
										</div>
									) : (
										<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
											<div className="flex flex-col items-center justify-center py-4">
												<Upload className="w-8 h-8 text-white/60 mb-2" />
												<p className="text-sm text-white/80">
													<span className="font-semibold">Click to upload</span> or drag and drop
												</p>
												<p className="text-xs text-white/50 mt-1">PNG, JPG or SVG (max. 2MB)</p>
											</div>
											<input
												type="file"
												className="hidden"
												accept="image/*"
												onChange={handleLogoUpload}
											/>
										</label>
									)}
								</div>
							</div>

							{/* Brand Colors */}
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6 relative z-10">
								<div className="flex items-center gap-3 mb-6">
									<div className="bg-pink-500/20 p-2 rounded-lg">
										<Palette className="w-5 h-5 text-pink-400" />
									</div>
									<h2 className="text-xl font-semibold text-white">Brand Colors</h2>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											Primary Color *
										</label>
										<div className="flex gap-3">
											<input
												type="color"
												{...register('primaryColor')}
												className="w-16 h-12 rounded-lg border border-white/30 bg-transparent cursor-pointer"
											/>
											<input
												type="text"
												value={primaryColor}
												onChange={(e) => setValue('primaryColor', e.target.value.toUpperCase())}
												className={getInputClasses(!!errors.primaryColor)}
												placeholder="#6366F1"
											/>
										</div>
										{errors.primaryColor && (
											<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{errors.primaryColor.message}
											</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-white/90 mb-2">
											Secondary Color *
										</label>
										<div className="flex gap-3">
											<input
												type="color"
												{...register('secondaryColor')}
												className="w-16 h-12 rounded-lg border border-white/30 bg-transparent cursor-pointer"
											/>
											<input
												type="text"
												value={secondaryColor}
												onChange={(e) => setValue('secondaryColor', e.target.value.toUpperCase())}
												className={getInputClasses(!!errors.secondaryColor)}
												placeholder="#10B981"
											/>
										</div>
										{errors.secondaryColor && (
											<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{errors.secondaryColor.message}
											</p>
										)}
									</div>
								</div>

								<div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
									<p className="text-white/70 text-sm mb-3">Color Preview:</p>
									<div className="flex gap-4">
										<div
											className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-medium"
											style={{ backgroundColor: primaryColor }}
										>
											Primary
										</div>
										<div
											className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-medium"
											style={{ backgroundColor: secondaryColor }}
										>
											Secondary
										</div>
									</div>
								</div>
							</div>

							{/* Save Button */}
							<div className="flex justify-end">
								<button
									type="submit"
									disabled={isSubmitting}
									className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
								>
									{isSubmitting ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
											Saving...
										</>
									) : (
										<>
											<Save className="w-5 h-5" />
											Save 
										</>
									)}
								</button>
							</div>
						</div>
					</form>
				)}

				{/* Team Members Tab */}
				{activeTab === 'team' && (
					<div className="space-y-6">
						{/* Team Members Header */}
						<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
								<div>
									<h2 className="text-xl font-semibold text-white mb-1">Team Members</h2>
									<p className="text-white/60 text-sm">
										Manage your team and send invitations
									</p>
								</div>
								<button
									onClick={() => setShowInviteModal(true)}
									className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
								>
									<Plus className="w-4 h-4" />
									Invite Member
								</button>
							</div>

							{/* Team Members List */}
							<div className="space-y-3">
								{teamMembers.map((member) => (
									<div
										key={member.id}
										className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
									>
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
														<span className="text-indigo-300 font-semibold text-sm">
															{member.name.charAt(0).toUpperCase()}
														</span>
													</div>
													<div>
														<h3 className="text-white font-medium">{member.name}</h3>
														<p className="text-white/60 text-sm">{member.email}</p>
													</div>
													{member.status === 'pending' && (
														<span className="px-2 py-1 text-xs font-semibold text-orange-300 bg-orange-500/20 rounded-full border border-orange-500/30">
															Pending
														</span>
													)}
												</div>
												<div className="flex flex-wrap gap-3 text-xs text-white/60 ml-13">
													<span className="flex items-center gap-1">
														<span className="font-medium text-white/80">Role:</span> {member.role}
													</span>
													<span className="flex items-center gap-1">
														<span className="font-medium text-white/80">Dept:</span> {member.department}
													</span>
													<span className="flex items-center gap-1">
														<span className="font-medium text-white/80">Joined:</span> {new Date(member.joinedAt).toLocaleDateString()}
													</span>
												</div>
											</div>

											<div className="flex gap-2">
												{member.status === 'pending' && (
													<button
														onClick={() => resendInvitation(member.email)}
														className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30 rounded-lg transition-colors text-sm flex items-center gap-1"
													>
														<Mail className="w-3.5 h-3.5" />
														Resend
													</button>
												)}
												<button
													onClick={() => removeMember(member.id)}
													className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors text-sm flex items-center gap-1"
												>
													<Trash2 className="w-3.5 h-3.5" />
													Remove
												</button>
											</div>
										</div>
									</div>
								))}

								{teamMembers.length === 0 && (
									<div className="text-center py-12">
										<Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
										<h3 className="text-white font-semibold mb-2">No team members yet</h3>
										<p className="text-white/60 text-sm mb-4">
											Invite your team to start collaborating
										</p>
										<button
											onClick={() => setShowInviteModal(true)}
											className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
										>
											<Plus className="w-4 h-4" />
											Invite First Member
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				</>
				)}
			</div>
		</main>
	)
}

export default CompanySettingsPage
