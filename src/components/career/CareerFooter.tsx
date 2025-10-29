'use client'

import React from 'react'
import { Company } from '@/types/company'
import { ExternalLink, Mail, Phone, MapPin } from 'lucide-react'

interface CareerFooterProps {
  company: Company
}

export default function CareerFooter({ company }: CareerFooterProps) {
  return (
    <footer 
      className="bg-gray-900 text-white py-12"
      style={{ backgroundColor: 'var(--brand-secondary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{company.companyName}</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              {company.companyDescription}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>{company.location}</span>
              </div>
              
              {company.websiteUrl && (
                <div className="flex items-center gap-2 text-gray-300">
                  <ExternalLink className="w-4 h-4" />
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {company.websiteUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#jobs" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Open Positions
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#culture" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Culture
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>careers@{company.subdomain}.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {company.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
