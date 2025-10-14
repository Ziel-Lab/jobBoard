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
	const secondaryColor = company?.branding?.secondaryColor || 'rgba(255,255,255,0.06)'
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

	return (
		<main
			className="min-h-screen"
			style={{ backgroundColor: primaryColor }}
		>
			<section className="mx-auto w-full max-w-5xl px-4 pt-20 pb-16 text-white">
				<header className="mb-8 flex items-center gap-4 rounded-2xl border border-white/10"
					style={{ backgroundColor: secondaryColor }}
				>
					<div className="p-4">
						<Image src={logoUrl} alt={company?.companyName || 'Company Logo'} width={56} height={56} className="h-14 w-14 rounded-md object-contain bg-white" />
					</div>
					<div className="py-4">
						<h1 className="text-xl sm:text-2xl font-semibold">{job?.jobTitle || job?.job_title}</h1>
						<p className="text-white/70 text-sm">{company?.companyName || company?.name}</p>
						<div className="mt-2 flex flex-wrap gap-2">
							<span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{job?.employmentType || '—'}</span>
							{job?.experienceLevel && (
								<span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{job.experienceLevel}</span>
							)}
							<span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{job?.isRemote ? 'Remote' : 'Onsite'}</span>
							{typeof job?.acceptingApplications === 'boolean' && (
								<span className={`rounded-full px-2.5 py-1 text-xs ${job.acceptingApplications ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'}`}>{job.acceptingApplications ? 'Accepting applications' : 'Closed'}</span>
							)}
						</div>
					</div>
				</header>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<article className="md:col-span-2 space-y-6">
						<section className="rounded-2xl border border-white/10 bg-white/5 p-6 leading-relaxed">
							<h2 className="mb-3 text-lg font-semibold">About the role</h2>
							<div className="prose prose-invert max-w-none">
								<div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
							</div>
						</section>

						{keyResponsibilitiesHtml && (
							<section className="rounded-2xl border border-white/10 bg-white/5 p-6 leading-relaxed">
								<h2 className="mb-3 text-lg font-semibold">Key responsibilities</h2>
								<div className="prose prose-invert max-w-none">
									<div dangerouslySetInnerHTML={{ __html: keyResponsibilitiesHtml }} />
								</div>
							</section>
						)}

						{requirementsHtml && (
							<section className="rounded-2xl border border-white/10 bg-white/5 p-6 leading-relaxed">
								<h2 className="mb-3 text-lg font-semibold">Requirements & qualifications</h2>
								<div className="prose prose-invert max-w-none">
									<div dangerouslySetInnerHTML={{ __html: requirementsHtml }} />
								</div>
							</section>
						)}

						{benefitsHtml && (
							<section className="rounded-2xl border border-white/10 bg-white/5 p-6 leading-relaxed">
								<h2 className="mb-3 text-lg font-semibold">Benefits & perks</h2>
								<div className="prose prose-invert max-w-none">
									<div dangerouslySetInnerHTML={{ __html: benefitsHtml }} />
								</div>
							</section>
						)}

						{Array.isArray(job?.requiredSkills) && job.requiredSkills.length > 0 && (
							<section className="rounded-2xl border border-white/10 bg-white/5 p-6">
								<h2 className="mb-3 text-lg font-semibold">Required skills</h2>
								<div className="flex flex-wrap gap-2">
									{job.requiredSkills.map((skill: string) => (
										<span key={skill} className="rounded-full bg-white/10 px-3 py-1 text-xs">
											{skill}
										</span>
									))}
								</div>
							</section>
						)}
					</article>
					<aside className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
						<div className="space-y-1">
							<p className="text-sm text-white/70">Location</p>
							<p className="text-sm font-medium">{job?.officeLocation || job?.location || '—'}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-white/70">Employment</p>
							<p className="text-sm font-medium">{job?.employmentType || '—'}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-white/70">Experience level</p>
							<p className="text-sm font-medium">{job?.experienceLevel || '—'}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-white/70">Work mode</p>
							<p className="text-sm font-medium">{job?.isRemote ? 'Remote' : 'Onsite'}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-white/70">Application deadline</p>
							<p className="text-sm font-medium">{formatDate(job?.applicationDeadline)}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-white/70">Accepting applications</p>
							<p className="text-sm font-medium">{typeof job?.acceptingApplications === 'boolean' ? (job.acceptingApplications ? 'Yes' : 'No') : '—'}</p>
						</div>
						{job?.minSalary && job?.maxSalary && (
							<div className="space-y-1">
								<p className="text-sm text-white/70">Compensation</p>
								<p className="text-sm font-medium">{job?.currency || 'USD'} {job?.minSalary} - {job?.maxSalary}</p>
							</div>
						)}
						{job?.applicationUrl && (
							<a href={job.applicationUrl} className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-white text-black px-4 py-2 font-semibold hover:opacity-90 transition">
								Apply now
							</a>
						)}
						<div className="pt-2 text-xs text-white/50">
							<p>Posted: {formatDate(job?.createdAt)}</p>
							<p>Updated: {formatDate(job?.updatedAt)}</p>
						</div>
					</aside>
				</div>
			</section>
		</main>
	)
}


