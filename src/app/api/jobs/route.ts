import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { Job, PaginatedJobs } from '@/types/job'

const JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend Engineer',
    company: 'Hulo',
    location: 'Bengaluru, IN',
    isRemote: true,
    employmentType: 'full-time',
    experienceLevel: 'mid',
    salaryMin: 1200000,
    salaryMax: 2400000,
    currency: 'INR',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    description: 'Build delightful UIs with Next.js, TypeScript and Tailwind.',
    applyUrl: '#',
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'Hulo',
    location: 'Remote',
    isRemote: true,
    employmentType: 'contract',
    experienceLevel: 'senior',
    salaryMin: 40,
    salaryMax: 80,
    currency: 'USD',
    skills: ['Node.js', 'PostgreSQL', 'Prisma', 'Redis'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    description: 'Design APIs and systems with performance and reliability in mind.',
    applyUrl: '#',
  },
  {
    id: '3',
    title: 'Product Designer',
    company: 'Hulo',
    location: 'Mumbai, IN',
    isRemote: false,
    employmentType: 'full-time',
    experienceLevel: 'mid',
    salaryMin: 1000000,
    salaryMax: 1800000,
    currency: 'INR',
    skills: ['Figma', 'UX', 'Design Systems'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    description: 'Craft intuitive experiences and components.',
    applyUrl: '#',
  },
]

function withinPostedWindow (iso: string, window: '24h' | '3d' | '7d' | '14d' | '30d')
{
  const ms = {
    '24h': 24 * 3600 * 1000,
    '3d': 3 * 24 * 3600 * 1000,
    '7d': 7 * 24 * 3600 * 1000,
    '14d': 14 * 24 * 3600 * 1000,
    '30d': 30 * 24 * 3600 * 1000,
  }[window]
  if (!ms) return true
  return Date.now() - new Date(iso).getTime() <= ms
}

export async function GET (req: Request)
{
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase() || ''
  const location = searchParams.get('location')?.toLowerCase()
  const type = searchParams.get('type') as Job['employmentType'] | null
  const remote = searchParams.get('remote')
  const experience = searchParams.get('experience') as Job['experienceLevel'] | null
  const postedWithin = searchParams.get('postedWithin') as '24h' | '3d' | '7d' | '14d' | '30d' | null
  const salaryMin = Number(searchParams.get('salaryMin') || '0')
  const salaryMax = Number(searchParams.get('salaryMax') || '0')
  const sort = (searchParams.get('sort') || 'recent') as 'recent' | 'salary-desc' | 'salary-asc'
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Number(searchParams.get('pageSize') || '24')

  let items = JOBS.filter(j =>
    (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skills.join(' ').toLowerCase().includes(q)) &&
    (!location || j.location.toLowerCase().includes(location)) &&
    (!type || j.employmentType === type) &&
    (!remote || (remote === 'true' ? j.isRemote : !j.isRemote)) &&
    (!experience || j.experienceLevel === experience) &&
    (!postedWithin || withinPostedWindow(j.postedAt, postedWithin)) &&
    (!salaryMin || (j.salaryMin ?? 0) >= salaryMin) &&
    (!salaryMax || (j.salaryMax ?? Infinity) <= salaryMax)
  )

  if (sort === 'recent') {
    items = items.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
  } else if (sort === 'salary-desc') {
    items = items.sort((a, b) => (b.salaryMax ?? 0) - (a.salaryMax ?? 0))
  } else if (sort === 'salary-asc') {
    items = items.sort((a, b) => (a.salaryMin ?? 0) - (b.salaryMin ?? 0))
  }

  const total = items.length
  const start = (page - 1) * pageSize
  const paged = items.slice(start, start + pageSize)

  const payload: PaginatedJobs = { items: paged, page, pageSize, total }
  return NextResponse.json(payload)
}

// Validation schema for job creation
const createJobSchema = z.object({
	title: z.string().min(3),
	location: z.string().min(2),
	isRemote: z.boolean(),
	employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
	experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']),
	salaryMin: z.number().min(0).optional(),
	salaryMax: z.number().min(0).optional(),
	currency: z.enum(['USD', 'EUR', 'GBP', 'INR']),
	description: z.string().min(50),
	responsibilities: z.string().min(20),
	requirements: z.string().min(20),
	benefits: z.string().optional(),
	skills: z.array(z.string()).min(1),
	applicationDeadline: z.string().optional(),
})

export async function POST(request: Request) {
	try {
		const body = await request.json()
		
		// Validate the request body
		const validatedData = createJobSchema.parse(body)
		
		// Create new job object
		const newJob: Job = {
			id: `job-${Date.now()}`,
			title: validatedData.title,
			company: 'Your Company', // TODO: Get from authenticated user's company profile
			location: validatedData.location,
			isRemote: validatedData.isRemote,
			employmentType: validatedData.employmentType,
			experienceLevel: validatedData.experienceLevel,
			salaryMin: validatedData.salaryMin,
			salaryMax: validatedData.salaryMax,
			currency: validatedData.currency,
			description: validatedData.description,
			skills: validatedData.skills,
			postedAt: new Date().toISOString(),
			applyUrl: '#', // TODO: Generate proper application URL
		}
		
		// In a real app, save to database
		// For now, just add to in-memory array
		JOBS.unshift(newJob)
		
		return NextResponse.json({
			success: true,
			message: 'Job posted successfully',
			data: newJob,
		}, { status: 201 })
		
	} catch (error) {
		console.error('Job creation error:', error)
		
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: 'Invalid job data provided',
					errors: error.issues,
				},
				{ status: 400 }
			)
		}
		
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
			},
			{ status: 500 }
		)
	}
}



