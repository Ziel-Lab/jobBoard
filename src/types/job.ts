export interface Job {
  id: string
  jobTitle: string
  company?: string
  officeLocation: string
  isRemote: boolean
  employmentType: 'full_time' | 'part_time' | 'contract' | 'internship'
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  minSalary?: number
  maxSalary?: number
  currency: 'USD' | 'EUR' | 'GBP' | 'INR'
  jobDescription: string
  keyResponsibilities: string
  requirementsQualifications: string
  benefitsPerks?: string
  requiredSkills: string[]
  applicationDeadline?: string
  jobStatus: 'draft' | 'published' | 'paused' | 'closed'
  createdAt: string
  updatedAt: string
  companyId?: string
}

export interface JobCreateInput {
  jobTitle: string
  employmentType: 'full_time' | 'part_time' | 'contract' | 'internship'
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  officeLocation: string
  isRemote: boolean
  currency: 'USD' | 'EUR' | 'GBP' | 'INR'
  minSalary?: number
  maxSalary?: number
  jobDescription: string
  keyResponsibilities: string
  requirementsQualifications: string
  benefitsPerks?: string
  requiredSkills: string[]
  applicationDeadline?: string
  jobStatus?: 'draft' | 'published'
}

export interface JobUpdateInput {
  jobTitle?: string
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'internship'
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead'
  officeLocation?: string
  isRemote?: boolean
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR'
  minSalary?: number
  maxSalary?: number
  jobDescription?: string
  keyResponsibilities?: string
  requirementsQualifications?: string
  benefitsPerks?: string
  requiredSkills?: string[]
  applicationDeadline?: string
  jobStatus?: 'draft' | 'published' | 'paused' | 'closed'
}

export interface JobsQuery {
  jobStatus?: 'draft' | 'published' | 'paused' | 'closed'
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'internship'
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead'
  isRemote?: boolean
  page?: number
  pageSize?: number
  sortBy?: 'created_at' | 'updated_at' | 'job_title'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedJobsResponse {
  jobs: Job[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalJobs: number
  }
}

export interface JobStatusChangeInput {
  status: 'draft' | 'published' | 'paused' | 'closed'
}


// Lightweight pagination shape used by jobs listing page
export interface PaginatedJobs {
  items: Job[]
  page: number
  pageSize: number
  total: number
}



