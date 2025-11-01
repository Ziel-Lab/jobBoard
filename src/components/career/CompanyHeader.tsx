'use client'

import React from 'react'
import { Company } from '@/types/company'
import Image from 'next/image'
import { ExternalLink, MapPin, Users, Building2 } from 'lucide-react'
import { PiBuildingsDuotone } from "react-icons/pi";

interface CompanyHeaderProps {
  company: Company
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
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

  return (
    <div className="relative bg-white shadow-lg">
      {/* Background with brand colors */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))`
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {company.logoUrl && company.logoUrl !== 'null' && company.logoUrl !== '' ? (
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src={company.logoUrl}
                  alt={`${company.companyName} logo`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl flex items-center justify-center text-white text-2xl lg:text-3xl font-bold shadow-lg"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <PiBuildingsDuotone className='w-12 h-12'/>
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {company.companyName}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{company.industry}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{getCompanySizeText(company.companySize)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{company.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 hover:opacity-90"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  View Open Positions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
