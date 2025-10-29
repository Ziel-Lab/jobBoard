'use client'

import React from 'react'

interface SubdomainNavbarProps {
  company: { companyName: string }
}

export default function SubdomainNavbar({ company: _company }: SubdomainNavbarProps) {

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          {/* <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              {company.logoUrl ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <Image
                    src={company.logoUrl}
                    alt={`${company.companyName} logo`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  {company.companyName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xl font-bold text-gray-900">
                {company.companyName}
              </span>
            </Link>
          </div> */}

          {/* Navigation Links */}
          

          {/* Mobile menu button */}
          {/* <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>
    </nav>
  )
}
