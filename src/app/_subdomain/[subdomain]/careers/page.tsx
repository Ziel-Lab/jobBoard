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

// Mock data for demonstration
const mockCompanyData: Company = {
  id: '1',
  subdomain: 'symb-technologies',
  companyName: 'Symb Technologies',
  logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
  websiteUrl: 'https://symb-technologies.com',
  industry: 'Technology',
  companySize: 'medium',
  subscriptionTier: 'premium',
  subscriptionStatus: 'active',
  settings: {},
  branding: {
    primaryColor: '#2563EB',
    secondaryColor: '#1E40AF',
    accentColor: '#F59E0B',
    textColor: '#1F2937',
    backgroundColor: '#FFFFFF'
  },
  isActive: true,
  isVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
  location: 'San Francisco, CA',
  companyDescription: 'We are a leading technology company focused on building innovative solutions that transform how businesses operate. Our team of passionate engineers and designers work together to create products that make a real difference in the world.',
  ownerId: 'owner-1'
}

const mockJobsData: Job[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'Symb Technologies',
    officeLocation: 'San Francisco, CA',
    isRemote: true,
    employmentType: 'full_time',
    experienceLevel: 'senior',
    minSalary: 120000,
    maxSalary: 160000,
    currency: 'USD',
    jobDescription: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using modern technologies.',
    keyResponsibilities: 'Develop and maintain React applications, Collaborate with design team, Code reviews and mentoring',
    requirementsQualifications: '5+ years React experience, TypeScript proficiency, Strong CSS skills',
    benefitsPerks: 'Health insurance, 401k matching, Flexible work hours, Remote work options',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Git'],
    applicationDeadline: '2024-03-15',
    jobStatus: 'published',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    companyId: '1'
  },
  {
    id: '2',
    jobTitle: 'Product Manager',
    company: 'Symb Technologies',
    officeLocation: 'San Francisco, CA',
    isRemote: false,
    employmentType: 'full_time',
    experienceLevel: 'mid',
    minSalary: 100000,
    maxSalary: 140000,
    currency: 'USD',
    jobDescription: 'Join our product team as a Product Manager and help shape the future of our platform. You will work closely with engineering, design, and business teams.',
    keyResponsibilities: 'Define product roadmap, Gather user requirements, Coordinate with cross-functional teams',
    requirementsQualifications: '3+ years product management experience, Technical background preferred, Strong communication skills',
    benefitsPerks: 'Health insurance, 401k matching, Stock options, Professional development budget',
    requiredSkills: ['Product Management', 'Agile', 'User Research', 'Analytics', 'Communication'],
    applicationDeadline: '2024-03-20',
    jobStatus: 'published',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    companyId: '1'
  },
  {
    id: '3',
    jobTitle: 'DevOps Engineer',
    company: 'Symb Technologies',
    officeLocation: 'San Francisco, CA',
    isRemote: true,
    employmentType: 'full_time',
    experienceLevel: 'mid',
    minSalary: 110000,
    maxSalary: 150000,
    currency: 'USD',
    jobDescription: 'We are seeking a DevOps Engineer to help us scale our infrastructure and improve our deployment processes.',
    keyResponsibilities: 'Manage cloud infrastructure, Automate deployment processes, Monitor system performance',
    requirementsQualifications: '3+ years DevOps experience, AWS/Azure knowledge, Docker and Kubernetes experience',
    benefitsPerks: 'Health insurance, 401k matching, Flexible work hours, Learning budget',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    applicationDeadline: '2024-03-25',
    jobStatus: 'published',
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
    companyId: '1'
  },
  {
    id: '4',
    jobTitle: 'UX Designer',
    company: 'Symb Technologies',
    officeLocation: 'San Francisco, CA',
    isRemote: true,
    employmentType: 'full_time',
    experienceLevel: 'mid',
    minSalary: 90000,
    maxSalary: 130000,
    currency: 'USD',
    jobDescription: 'We are looking for a talented UX Designer to join our design team and help create amazing user experiences.',
    keyResponsibilities: 'Design user interfaces, Conduct user research, Create wireframes and prototypes',
    requirementsQualifications: '3+ years UX design experience, Proficiency in Figma/Sketch, Strong portfolio',
    benefitsPerks: 'Health insurance, 401k matching, Design tools budget, Flexible work hours',
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'UI/UX Design', 'Adobe Creative Suite'],
    applicationDeadline: '2024-03-30',
    jobStatus: 'published',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
    companyId: '1'
  }
]

export default function CareersPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, fetch from API based on subdomain
      setCompany(mockCompanyData)
      setJobs(mockJobsData)
      setIsLoading(false)
    }
    
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
