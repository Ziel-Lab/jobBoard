export interface Job
{
  id: string
  title: string
  company: string
  location: string
  isRemote: boolean
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship'
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  salaryMin?: number
  salaryMax?: number
  currency: 'USD' | 'EUR' | 'GBP' | 'INR'
  skills: string[]
  postedAt: string
  description: string
  applyUrl: string
}

export interface JobsQuery
{
  q?: string
  location?: string
  type?: Job['employmentType']
  remote?: 'true' | 'false'
  experience?: Job['experienceLevel']
  postedWithin?: '24h' | '3d' | '7d' | '14d' | '30d'
  salaryMin?: string
  salaryMax?: string
  page?: string
  pageSize?: string
  sort?: 'recent' | 'salary-desc' | 'salary-asc'
}

export interface PaginatedJobs
{
  items: Job[]
  page: number
  pageSize: number
  total: number
}



