'use client'

import React, { useState, useEffect } from 'react'
import { Company } from '@/types/company'
import CareerFooter from '@/components/career/CareerFooter'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Mock data for demonstration
const mockCompanyData: Company = {
  id: '1',
  subdomain: 'techcorp',
  companyName: 'TechCorp Solutions',
  logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
  websiteUrl: 'https://techcorp.com',
  industry: 'Technology',
  companySize: 'medium',
  subscriptionTier: 'premium',
  subscriptionStatus: 'active',
  settings: {},
  branding: {
    primaryColor: '#3B82F6',
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


export default function SubdomainHomePage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, fetch from API based on subdomain
      setCompany(mockCompanyData)
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
      
      {/* <SubdomainNavbar company={company} /> */}
      
      {/* Hero Section */}
      <div className="relative bg-white">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to {company.companyName}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {company.companyDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/careers"
                className="inline-flex items-center gap-2 px-8 py-4 text-white font-medium rounded-lg transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                View Open Positions
              </a>
              
              {company.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Visit Our Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: 'var(--brand-primary)' }}>
                {company.companySize === 'startup' ? '1-10' : company.companySize === 'small' ? '11-50' : company.companySize === 'medium' ? '51-200' : '200+'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Size</h3>
              <p className="text-gray-600">{company.companySize === 'startup' ? '1-10 employees' : company.companySize === 'small' ? '11-50 employees' : company.companySize === 'medium' ? '51-200 employees' : '200+ employees'}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: 'var(--brand-accent)' }}>
                {company.industry.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry</h3>
              <p className="text-gray-600">{company.industry}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: 'var(--brand-secondary)' }}>
                📍
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{company.location}</p>
            </div>
          </div>
        </div>
      </div>

      <CareerFooter company={company} />
    </div>
  )
}
