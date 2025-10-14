import Image from 'next/image'
import { headers } from 'next/headers'
import type { Job } from '@/types/job'

export const dynamic = 'force-dynamic'

interface PublicJobPageProps
{
	params: Promise<{ id: string }>
}

interface CompanyBranding {
	primaryColor?: string
	secondaryColor?: string
}

interface CompanyInfo {
	companyName?: string
	name?: string
	logoUrl?: string
	branding: CompanyBranding
}

type PublicJob = Omit<Job, 'company'> & {
    company?: CompanyInfo
    jobDescriptionHtml?: string
    job_description?: string
    location?: string
    job_title?: string
    isActive?: boolean
    acceptingApplications?: boolean
    applicationUrl?: string
}

async function fetchPublicJob (jobId: string, origin: string)
{
	let subdomain = ''
	try {
		const { hostname } = new URL(origin)
		const parts = hostname.split('.')
		if (parts.length > 2 || (parts.length === 2 && parts[0] !== 'localhost')) {
			const sub = parts[0]
			if (sub && sub !== 'www' && sub !== 'localhost') subdomain = sub
		}
	} catch {}
	const qp = subdomain ? `?subdomain=${encodeURIComponent(subdomain)}` : ''
	const url = `${origin}/api/jobs/public/${jobId}${qp}`
	const res = await fetch(url, { next: { revalidate: 60 } })
	if (!res.ok) {
		console.log('Failed to load job', res.statusText)
		return { success: false, data: null }
	}
	return res.json() as Promise<{ success: boolean; data: PublicJob | null }>
}

export default async function PublicJobPage ({ params }: PublicJobPageProps)
{
	// Prefer the incoming request host (preserves subdomain); fallback to env/default
	const h = await headers()
	const host = h.get('host') || process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 'localhost:3000'
	const proto = h.get('x-forwarded-proto') || (process.env.NEXT_PUBLIC_APP_URL?.startsWith('https') ? 'https' : 'http')
	const origin = `${proto}://${host}`
    const { id } = await params
    const { data } = await fetchPublicJob(id, origin)

    const job = data
    if (!job || job.isActive === false) {
		const { notFound } = await import('next/navigation')
		notFound()
	}
    const jobData = job as PublicJob
    console.log('job', jobData)
    const company: CompanyInfo | undefined = jobData.company
	const primaryColor = company?.branding?.primaryColor || '#0b1220'
	const logoUrl = company?.logoUrl || '/vercel.svg'

	// Ensure job description renders even when only plain text is provided
    const rawDescription = jobData.jobDescriptionHtml || jobData.jobDescription || jobData.job_description || ''
	const descriptionHtml = typeof rawDescription === 'string' ? rawDescription.replace(/\n/g, '<br/>') : ''

    const keyResponsibilitiesHtml = (jobData.keyResponsibilities || '')
        ? String(jobData.keyResponsibilities).replace(/\n/g, '<br/>')
		: ''

    const requirementsHtml = (jobData.requirementsQualifications || '')
        ? String(jobData.requirementsQualifications).replace(/\n/g, '<br/>')
		: ''

    const benefitsHtml = (jobData.benefitsPerks || '')
        ? String(jobData.benefitsPerks).replace(/\n/g, '<br/>')
		: ''

	function formatDate (iso?: string): string
	{
		if (!iso) return '—'
		try {
			return new Date(iso).toLocaleDateString(undefined, {
				year: 'numeric', month: 'short', day: '2-digit',
			})
		} catch {
			return '—'
		}
	}

	function formatEmploymentType(type?: string): string 
	{
		if (!type) return 'Not specified'
		return type
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ')
	}

	return (
		<main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			{/* Dark Theme Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
			
			{/* Subtle Pattern Overlay */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12" />
				<div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-white/3 to-transparent rounded-full blur-3xl" />
			</div>

			<section className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-16 text-white">
				{/* Modern Header Section */}
				<header className="mb-8 sm:mb-12">
					<div className="relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-md bg-white/5">
						{/* Header gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
						
						<div className="relative p-6 sm:p-8">
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
								{/* Company Logo */}
								<div className="relative">
									<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden">
										<Image 
											src={logoUrl} 
											alt={company?.companyName || 'Company Logo'} 
											width={80} 
											height={80} 
											className="w-full h-full object-contain p-2" 
										/>
									</div>
									<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md" />
								</div>

								{/* Job Info */}
								<div className="flex-1 min-w-0">
									<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
										{job?.jobTitle || job?.job_title}
									</h1>
									<p className="text-lg text-white/70 mb-4">
										{company?.companyName || company?.name}
									</p>
									
									{/* Tags with Brand Colors */}
									<div className="flex flex-wrap gap-2">
										<span 
											className="px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border"
											style={{ 
												backgroundColor: `${primaryColor}20`,
												borderColor: `${primaryColor}50`,
												color: primaryColor
											}}
										>
											{formatEmploymentType(job?.employmentType)}
										</span>
										{job?.experienceLevel && (
											<span 
												className="px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border"
												style={{ 
													backgroundColor: `${primaryColor}20`,
													borderColor: `${primaryColor}50`,
													color: primaryColor
												}}
											>
												{job.experienceLevel}
											</span>
										)}
										<span 
											className="px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border"
											style={{ 
												backgroundColor: `${primaryColor}20`,
												borderColor: `${primaryColor}50`,
												color: primaryColor
											}}
										>
											{job?.isRemote ? '🌍 Remote' : '🏢 On-site'}
										</span>
										{typeof job?.acceptingApplications === 'boolean' && (
											<span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
												job.acceptingApplications 
													? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
													: 'bg-red-500/20 text-red-300 border border-red-500/30'
											}`}>
												{job.acceptingApplications ? '✅ Open' : '❌ Closed'}
											</span>
										)}
									</div>
								</div>

								{/* Apply Button - Desktop */}
								{job?.applicationUrl && (
									<div className="hidden sm:block">
										<a 
											href={job.applicationUrl}
											className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-white"
											style={{
												background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
											}}
										>
											<span>Apply Now</span>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
											</svg>
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
				</header>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<article className="lg:col-span-2 space-y-8">
						{/* Job Description */}
						<section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
							<div className="p-6 sm:p-8">
								<div className="flex items-center gap-3 mb-6">
									<div 
										className="w-10 h-10 rounded-2xl flex items-center justify-center"
										style={{ backgroundColor: `${primaryColor}20` }}
									>
										<svg className="w-5 h-5" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<h2 className="text-xl sm:text-2xl font-bold">About the Role</h2>
								</div>
								<div className="prose prose-lg prose-invert max-w-none">
									<div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
								</div>
							</div>
						</section>

						{/* Key Responsibilities */}
						{keyResponsibilitiesHtml && (
							<section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
								<div className="p-6 sm:p-8">
									<div className="flex items-center gap-3 mb-6">
										<div 
											className="w-10 h-10 rounded-2xl flex items-center justify-center"
											style={{ backgroundColor: `${primaryColor}20` }}
										>
											<svg className="w-5 h-5" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										</div>
										<h2 className="text-xl sm:text-2xl font-bold">Key Responsibilities</h2>
									</div>
									<div className="prose prose-lg prose-invert max-w-none">
										<div dangerouslySetInnerHTML={{ __html: keyResponsibilitiesHtml }} />
									</div>
								</div>
							</section>
						)}

						{/* Requirements */}
						{requirementsHtml && (
							<section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
								<div className="p-6 sm:p-8">
									<div className="flex items-center gap-3 mb-6">
										<div 
											className="w-10 h-10 rounded-2xl flex items-center justify-center"
											style={{ backgroundColor: `${primaryColor}20` }}
										>
											<svg className="w-5 h-5" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
											</svg>
										</div>
										<h2 className="text-xl sm:text-2xl font-bold">Requirements & Qualifications</h2>
									</div>
									<div className="prose prose-lg prose-invert max-w-none">
										<div dangerouslySetInnerHTML={{ __html: requirementsHtml }} />
									</div>
								</div>
							</section>
						)}

						{/* Benefits */}
						{benefitsHtml && (
							<section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
								<div className="p-6 sm:p-8">
									<div className="flex items-center gap-3 mb-6">
										<div 
											className="w-10 h-10 rounded-2xl flex items-center justify-center"
											style={{ backgroundColor: `${primaryColor}20` }}
										>
											<svg className="w-5 h-5" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
											</svg>
										</div>
										<h2 className="text-xl sm:text-2xl font-bold">Benefits & Perks</h2>
									</div>
									<div className="prose prose-lg prose-invert max-w-none">
										<div dangerouslySetInnerHTML={{ __html: benefitsHtml }} />
									</div>
								</div>
							</section>
						)}

						{/* Required Skills */}
						{Array.isArray(job?.requiredSkills) && job.requiredSkills.length > 0 && (
							<section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
								<div className="p-6 sm:p-8">
									<div className="flex items-center gap-3 mb-6">
										<div 
											className="w-10 h-10 rounded-2xl flex items-center justify-center"
											style={{ backgroundColor: `${primaryColor}20` }}
										>
											<svg className="w-5 h-5" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
											</svg>
										</div>
										<h2 className="text-xl sm:text-2xl font-bold">Required Skills</h2>
									</div>
									<div className="flex flex-wrap gap-3">
										{job.requiredSkills.map((skill: string) => (
											<span 
												key={skill} 
												className="px-4 py-2 rounded-2xl text-sm font-medium backdrop-blur-sm border hover:scale-105 transition-transform duration-200"
												style={{ 
													backgroundColor: `${primaryColor}15`,
													borderColor: `${primaryColor}30`,
													color: primaryColor
												}}
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							</section>
						)}
					</article>

					{/* Sidebar */}
					<aside className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden h-fit sticky top-8">
						<div className="p-6 sm:p-8 space-y-6">
							<h3 className="text-xl font-bold mb-6">Job Details</h3>
							
							{/* Job Details */}
							<div className="space-y-5">
								<div className="flex items-start gap-3">
									<div 
										className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
										style={{ backgroundColor: `${primaryColor}20` }}
									>
										<svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									</div>
									<div>
										<p className="text-sm font-medium text-white/70">Location</p>
										<p className="text-base font-semibold">{job?.officeLocation || job?.location || 'Not specified'}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div 
										className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
										style={{ backgroundColor: `${primaryColor}20` }}
									>
										<svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2V6a2 2 0 00-2-2z" />
										</svg>
									</div>
									<div>
										<p className="text-sm font-medium text-white/70">Employment Type</p>
										<p className="text-base font-semibold">{formatEmploymentType(job?.employmentType)}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div 
										className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
										style={{ backgroundColor: `${primaryColor}20` }}
									>
										<svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
										</svg>
									</div>
									<div>
										<p className="text-sm font-medium text-white/70">Experience Level</p>
										<p className="text-base font-semibold">{job?.experienceLevel || 'Not specified'}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div 
										className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
										style={{ backgroundColor: `${primaryColor}20` }}
									>
										<svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
										</svg>
									</div>
									<div>
										<p className="text-sm font-medium text-white/70">Work Mode</p>
										<p className="text-base font-semibold">{job?.isRemote ? 'Remote' : 'On-site'}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div 
										className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
										style={{ backgroundColor: `${primaryColor}20` }}
									>
										<svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L16 7" />
										</svg>
									</div>
									<div>
										<p className="text-sm font-medium text-white/70">Application Deadline</p>
										<p className="text-base font-semibold">{formatDate(job?.applicationDeadline)}</p>
									</div>
								</div>

								{job?.minSalary && job?.maxSalary && (
									<div className="flex items-start gap-3">
										<div 
											className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
											style={{ backgroundColor: `${primaryColor}20` }}
										>
											<svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
											</svg>
										</div>
										<div>
											<p className="text-sm font-medium text-white/70">Compensation</p>
											<p className="text-base font-semibold">
												{job.currency || 'USD'} {job.minSalary?.toLocaleString()} - {job.maxSalary?.toLocaleString()}
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Apply Button - Mobile/Tablet */}
							{job?.applicationUrl && (
								<div className="pt-6 border-t border-white/20">
									<a 
										href={job.applicationUrl}
										className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-white"
										style={{
											background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
										}}
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
										</svg>
										Apply Now
									</a>
								</div>
							)}

							{/* Job Meta Info */}
							<div className="pt-4 text-sm text-white/50 space-y-2 border-t border-white/20">
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>Posted: {formatDate(job?.createdAt)}</span>
								</div>
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									<span>Updated: {formatDate(job?.updatedAt)}</span>
								</div>
							</div>
						</div>
					</aside>
				</div>
			</section>
		</main>
	)
}


