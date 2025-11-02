'use client'

import React from 'react'
import { Company } from '@/types/company'
import { Building2, Users, MapPin, Globe, Calendar } from 'lucide-react'

interface CompanyAboutProps {
  company: Company
}

export default function CompanyAbout({ company }: CompanyAboutProps) {
  const getCompanySizeText = (size: string) => {
    switch (size) {
      case 'startup': return '1-10 employees'
      case 'small': return '11-50 employees'
      case 'medium': return '51-200 employees'
      case 'large': return '201-1000 employees'
      case 'enterprise': return '1000+ employees'
      default: return 'Unknown size'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About {company.companyName}</h2>
            
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                {company.companyDescription}
              </p>
              
              
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Industry</p>
                    <p className="text-gray-900">{company.industry}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company Size</p>
                    <p className="text-gray-900">{getCompanySizeText(company.companySize)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900">{company.location}</p>
                  </div>
                </div>
                
                {company.websiteUrl && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        {company.websiteUrl}
                      </a>
                    </div>
                  </div>
                )}
                
                {/* <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Founded</p>
                    <p className="text-gray-900">{formatDate(company.createdAt)}</p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Why Work With Us */}
            {/* <div 
              className="rounded-xl p-6 text-white"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <h3 className="text-xl font-semibold mb-4">Why Work With Us?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                  Competitive salary and benefits
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                  Flexible work arrangements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                  Professional development opportunities
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                  Collaborative and inclusive culture
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                  Cutting-edge technology stack
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
