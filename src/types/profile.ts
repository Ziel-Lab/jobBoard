export interface SocialLink
{
  label: string
  url: string
}

export interface Experience
{
  id: string
  role: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  summary?: string
  achievements?: string[]
  skills?: string[]
}

export interface Education
{
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate?: string
}

export interface Project
{
  id: string
  name: string
  description: string
  skills?: string[]
  link?: string
}

export interface Certification
{
  id: string
  name: string
  issuer: string
  date: string
}

export interface CandidateProfile
{
  id: string
  fullName: string
  headline: string
  location: string
  email: string
  phone?: string
  website?: string
  socials?: SocialLink[]
  summary?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  projects?: Project[]
  certifications?: Certification[]
  preferences?: {
    locations?: string[]
    remote?: boolean
    employmentTypes?: Array<'full-time' | 'part-time' | 'contract' | 'internship'>
    expectedSalaryMin?: number
    expectedSalaryMax?: number
    currency?: 'USD' | 'EUR' | 'GBP' | 'INR'
  }
  resumeUrl?: string
}

export interface EmployerProfile
{
  id: string
  companyName: string
  location: string
  website?: string
  description?: string
  size?: string
  industry?: string
  socials?: SocialLink[]
}


