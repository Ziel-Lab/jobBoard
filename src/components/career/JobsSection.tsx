'use client'

import React, { useState, useMemo } from 'react'
import { Job } from '@/types/job'
import { Company as CompanyType } from '@/types/company'
import { MapPin, Clock, DollarSign, Briefcase, Users, Calendar, Search, Filter, X } from 'lucide-react'

interface JobsSectionProps {
  jobs: Job[]
  company: CompanyType
}

export default function JobsSection({ jobs, company }: JobsSectionProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('all')
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const formatSalary = (min?: number, max?: number, currency: string = 'USD') => {
    if (!min && !max) return 'Salary not specified'
    
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
    
    if (min && max) {
      return `${formatCurrency(min)} - ${formatCurrency(max)}`
    } else if (min) {
      return `${formatCurrency(min)}+`
    } else if (max) {
      return `Up to ${formatCurrency(max)}`
    }
    
    return 'Salary not specified'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getEmploymentTypeText = (type: string) => {
    switch (type) {
      case 'full_time': return 'Full-time'
      case 'part_time': return 'Part-time'
      case 'contract': return 'Contract'
      case 'internship': return 'Internship'
      default: return type
    }
  }

  const getExperienceLevelText = (level: string) => {
    switch (level) {
      case 'entry': return 'Entry Level'
      case 'mid': return 'Mid Level'
      case 'senior': return 'Senior Level'
      case 'lead': return 'Lead Level'
      default: return level
    }
  }

  const isApplicationDeadlineNear = (deadline?: string) => {
    if (!deadline) return false
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0
  }

  // Get unique values for filter options
  const employmentTypes = useMemo(() => {
    const types = [...new Set(jobs.map(job => job.employmentType))]
    return types.map(type => ({ value: type, label: getEmploymentTypeText(type) }))
  }, [jobs])

  const experienceLevels = useMemo(() => {
    const levels = [...new Set(jobs.map(job => job.experienceLevel))]
    return levels.map(level => ({ value: level, label: getExperienceLevelText(level) }))
  }, [jobs])

  const locations = useMemo(() => {
    const locs = [...new Set(jobs.map(job => job.officeLocation))]
    return locs.map(location => ({ value: location, label: location }))
  }, [jobs])

  // Filter jobs based on search and filter criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesEmploymentType = selectedEmploymentType === 'all' || job.employmentType === selectedEmploymentType
      const matchesExperienceLevel = selectedExperienceLevel === 'all' || job.experienceLevel === selectedExperienceLevel
      const matchesLocation = selectedLocation === 'all' || job.officeLocation === selectedLocation

      return matchesSearch && matchesEmploymentType && matchesExperienceLevel && matchesLocation
    })
  }, [jobs, searchTerm, selectedEmploymentType, selectedExperienceLevel, selectedLocation])

  // Reset to first page whenever filters/search change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedEmploymentType, selectedExperienceLevel, selectedLocation])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredJobs.length / pageSize))
  }, [filteredJobs.length, pageSize])

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredJobs.slice(start, end)
  }, [filteredJobs, currentPage, pageSize])

  // Reset selected job if it's not in current page results
  React.useEffect(() => {
    if (selectedJob && !paginatedJobs.find(job => job.id === selectedJob.id)) {
      setSelectedJob(paginatedJobs.length > 0 ? paginatedJobs[0] : null)
    } else if (!selectedJob && paginatedJobs.length > 0) {
      setSelectedJob(paginatedJobs[0])
    }
  }, [paginatedJobs, selectedJob])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedEmploymentType('all')
    setSelectedExperienceLevel('all')
    setSelectedLocation('all')
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Open Positions at {company.companyName}
          </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our team and help us build the future. We&apos;re looking for talented individuals 
              who share our passion for innovation and excellence.
            </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, description, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle and Clear */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {[selectedEmploymentType, selectedExperienceLevel, selectedLocation].filter(f => f !== 'all').length}
                  </span>
                )}
              </button>
              
              {([selectedEmploymentType, selectedExperienceLevel, selectedLocation].some(f => f !== 'all') || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Employment Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={selectedEmploymentType}
                    onChange={(e) => setSelectedEmploymentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    {employmentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={selectedExperienceLevel}
                    onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(location => (
                      <option key={location.value} value={location.value}>
                        {location.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Results Count and Page Size */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
              <div>
                {filteredJobs.length === jobs.length ? (
                  <span>Showing all {jobs.length} positions</span>
                ) : (
                  <span>Showing {filteredJobs.length} of {jobs.length} positions</span>
                )}
                {filteredJobs.length > 0 && (
                  <span className="ml-2">· Page {currentPage} of {totalPages}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[5, 6, 8, 10, 12].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Open Positions</h3>
            <p className="text-gray-600">We don&apos;t have any open positions at the moment, but check back soon!</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-4">No positions match your current search and filter criteria.</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-white rounded-lg transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Jobs List */}
            <div className="space-y-4">
              {paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    selectedJob?.id === job.id 
                      ? 'border-blue-500 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {job.jobTitle}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.officeLocation}</span>
                            {job.isRemote && (
                              <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Remote
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{getExperienceLevelText(job.experienceLevel)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{getEmploymentTypeText(job.employmentType)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mb-3">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatSalary(job.minSalary, job.maxSalary, job.currency)}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {job.jobDescription}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Posted {formatDate(job.createdAt)}</span>
                        </div>
                        
                        {job.applicationDeadline && (
                          <div className={`flex items-center gap-1 ${
                            isApplicationDeadlineNear(job.applicationDeadline) 
                              ? 'text-red-600 font-medium' 
                              : 'text-gray-500'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>
                              {isApplicationDeadlineNear(job.applicationDeadline) 
                                ? `Deadline: ${formatDate(job.applicationDeadline)}` 
                                : `Apply by ${formatDate(job.applicationDeadline)}`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 hover:opacity-90"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle apply action
                        }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                    style={{ backgroundColor: 'white' }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const page = idx + 1
                      const isActive = page === currentPage
                      return (
                        <button
                          key={page}
                          className={`px-3 py-2 text-sm rounded-md border ${isActive ? 'text-white' : 'text-gray-700 border-gray-300'}`}
                          style={{ backgroundColor: isActive ? 'var(--brand-primary)' : 'white' }}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                    style={{ backgroundColor: 'white' }}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              {selectedJob ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedJob.jobTitle}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedJob.officeLocation}</span>
                        {selectedJob.isRemote && (
                          <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Remote
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{getExperienceLevelText(selectedJob.experienceLevel)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{getEmploymentTypeText(selectedJob.employmentType)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-lg font-semibold text-gray-900 mb-4">
                      <DollarSign className="w-5 h-5" />
                      <span>{formatSalary(selectedJob.minSalary, selectedJob.maxSalary, selectedJob.currency)}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedJob.jobDescription}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h4>
                      <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {selectedJob.keyResponsibilities}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements & Qualifications</h4>
                      <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {selectedJob.requirementsQualifications}
                      </div>
                    </div>

                    {selectedJob.benefitsPerks && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Benefits & Perks</h4>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {selectedJob.benefitsPerks}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedJob.applicationDeadline && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            Application Deadline: {formatDate(selectedJob.applicationDeadline)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      className="w-full py-3 px-6 text-white font-medium rounded-lg transition-colors duration-200 hover:opacity-90"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      Apply for this position
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Job</h3>
                  <p className="text-gray-600">Choose a position from the list to view details and apply.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
