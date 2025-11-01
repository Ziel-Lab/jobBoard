'use client'

import React, { useState, useEffect } from 'react'
import { Company } from '@/types/company'
import { Job } from '@/types/job'
import SubdomainNavbar from '@/components/career/SubdomainNavbar'
import CompanyHeader from '@/components/career/CompanyHeader'
import JobsSection from '@/components/career/JobsSection'
import CompanyAbout from '@/components/career/CompanyAbout'
import CareerFooter from '@/components/career/CareerFooter'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Helper function to get subdomain from current URL (matches employer page logic)
const getSubdomainFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null
  
  const hostname = window.location.hostname.toLowerCase()
  
  // Handle *.localhost (e.g., coldrockcafe.localhost)
  if (hostname.endsWith('.localhost')) {
    const subdomain = hostname.replace('.localhost', '')
    return subdomain || null
  }
  
  // Handle production domains (e.g., company.jobboard.com)
  const parts = hostname.split('.')
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0]
  }
  
  return null
}

// API endpoint for company data - use Next.js API route to avoid CORS
const getCompanyApiUrl = (subdomain: string): string => 
  `/api/company/public/${subdomain}`

// Helper function to transform API response to Company type
const transformCompanyData = (apiData: Record<string, unknown>): Company => {
  return {
    id: String(apiData.id),
    subdomain: String(apiData.subdomain),
    companyName: String(apiData.companyName),
    logoUrl: String(apiData.logoUrl),
    websiteUrl: String(apiData.website),
    industry: String(apiData.industry),
    companySize: apiData.companySize === '11-50 employees' ? 'medium' : 'small',
    subscriptionTier: 'premium',
    subscriptionStatus: 'active',
    settings: {},
    branding: {
      primaryColor: (apiData.branding as Record<string, unknown>)?.primaryColor as string || '#3B82F6',
      secondaryColor: (apiData.branding as Record<string, unknown>)?.secondaryColor as string || '#1E40AF',
      accentColor: '#F59E0B',
      textColor: '#1F2937',
      backgroundColor: '#FFFFFF'
    },
    isActive: Boolean(apiData.isActive),
    isVerified: Boolean(apiData.isVerified),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: String(apiData.location),
    companyDescription: String(apiData.description),
    ownerId: 'owner-1'
  }
}

// API endpoint for jobs data
const getJobsApiUrl = (subdomain: string, page: number = 1, pageSize: number = 10): string => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortBy: 'created_at',
    sortOrder: 'desc',
    jobStatus: 'published'
  })
  return `/api/jobs/public?${params.toString()}`
}

// Interface for public jobs API response
interface PublicJobsResponse {
  jobs: Job[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  company?: unknown
}

export default function CareersPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      try {
        // Get subdomain from current URL
        const subdomain = getSubdomainFromUrl()
        
        if (!subdomain) {
          console.error('No subdomain found on initial load')
          setIsLoading(false)
          return
        }
        
        console.log('Loading data for subdomain:', subdomain)
        const companyApiUrl = getCompanyApiUrl(subdomain)
        const jobsApiUrl = getJobsApiUrl(subdomain, 1, 20)
        
        console.log('Company API URL:', companyApiUrl)
        console.log('Jobs API URL:', jobsApiUrl)
        
        // Fetch both company and jobs data in parallel
        const [companyResponse, jobsResponse] = await Promise.all([
          fetch(companyApiUrl),
          fetch(jobsApiUrl, {
            headers: {
              'X-Company-Subdomain': subdomain
            }
          })
        ])
        
        // Handle company data
        if (!companyResponse.ok) {
          throw new Error(`Failed to fetch company data: ${companyResponse.status} ${companyResponse.statusText}`)
        }
        const companyData = await companyResponse.json()
        console.log('Company data received:', companyData)
        
        // Transform API data to Company type
        const transformedCompany = transformCompanyData(companyData)
        setCompany(transformedCompany)
        
        // Handle jobs data
        if (!jobsResponse.ok) {
          console.error(`Failed to fetch jobs data: ${jobsResponse.status} ${jobsResponse.statusText}`)
          setJobs([])
        } else {
          const jobsData = await jobsResponse.json()
          console.log('Jobs API response:', jobsData)
          
          // Handle the API response structure
          if (jobsData.success && jobsData.data) {
            const responseData = jobsData.data as PublicJobsResponse
            setJobs(responseData.jobs || [])
          } else if (jobsData.jobs) {
            // Handle direct response format
            setJobs(jobsData.jobs || [])
          } else {
            console.warn('Unexpected jobs response format')
            setJobs([])
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        // Don't set any fallback data - let the component handle the error state
      } finally {
        setIsLoading(false)
      }
    }
    
    // Load data on mount
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
          <p className="text-gray-600">The company you&apos;re looking for doesn&apos;t exist or is not available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apply dynamic brand colors */}
      <style jsx global>{`
        :root {
          --brand-primary: ${company.branding.primaryColor || '#3B82F6'};
          --brand-secondary: ${company.branding.secondaryColor || '#1E40AF'};
          --brand-accent: ${company.branding.accentColor || '#F59E0B'};
          --brand-text: ${company.branding.textColor || '#1F2937'};
          --brand-bg: ${company.branding.backgroundColor || '#FFFFFF'};
        }
      `}</style>
      
      <SubdomainNavbar company={company} />
      <CompanyHeader company={company} />
      <CompanyAbout company={company} />
      <JobsSection jobs={jobs} company={company} />
      <CareerFooter company={company} />
    </div>
  )
}
