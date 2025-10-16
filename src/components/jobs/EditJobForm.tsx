'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jobsApi } from '@/lib/jobs-api'
import { Job, JobUpdateInput } from '@/types/job'
import { Loader2 } from 'lucide-react'
import { TagInput } from '@/components/ui/TagInput'

interface EditJobFormProps {
  id: string
}

export default function EditJobForm({ id }: EditJobFormProps) {
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<JobUpdateInput>({})
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await jobsApi.getJob(id)
        if (jobData) {
          setJob(jobData)
          setFormData({
            jobTitle: jobData.jobTitle,
            employmentType: jobData.employmentType,
            experienceLevel: jobData.experienceLevel,
            officeLocation: jobData.officeLocation,
            isRemote: jobData.isRemote,
            currency: jobData.currency,
            minSalary: jobData.minSalary,
            maxSalary: jobData.maxSalary,
            jobDescription: jobData.jobDescription,
            keyResponsibilities: jobData.keyResponsibilities,
            requirementsQualifications: jobData.requirementsQualifications,
            benefitsPerks: jobData.benefitsPerks,
            requiredSkills: jobData.requiredSkills,
            applicationDeadline: jobData.applicationDeadline,
          })
        }
      } catch (err) {
        setError('Failed to load job details')
        console.error('Error fetching job:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const updatedJob = await jobsApi.updateJob(id, formData)
      if (updatedJob) {
        router.push('/employer/jobs')
        router.refresh()
      } else {
        setError('Failed to update job. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while updating the job')
      console.error('Error updating job:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
          <p className="text-white/60 mb-6">The job you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.</p>
          <button
            onClick={() => router.push('/employer/jobs')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black relative">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="mb-8 px-4 py-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back
        </button>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Edit Job</h1>
          <p className="text-white/60 mb-8">Update your job posting details</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-white mb-2">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
            </div>

            {/* Employment Type & Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-white mb-2">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                >
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-white mb-2">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead Level</option>
                </select>
              </div>
            </div>

            {/* Location & Remote */}
            <div>
              <label htmlFor="officeLocation" className="block text-sm font-medium text-white mb-2">
                Office Location
              </label>
              <input
                type="text"
                id="officeLocation"
                name="officeLocation"
                value={formData.officeLocation || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isRemote"
                    checked={formData.isRemote || false}
                    onChange={handleCheckboxChange}
                    className="form-checkbox rounded bg-white/10 border-white/20 text-indigo-600 focus:ring-indigo-500/50"
                  />
                  <span className="ml-2 text-white">Remote work available</span>
                </label>
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-white mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>

              <div>
                <label htmlFor="minSalary" className="block text-sm font-medium text-white mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  id="minSalary"
                  name="minSalary"
                  value={formData.minSalary || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label htmlFor="maxSalary" className="block text-sm font-medium text-white mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  id="maxSalary"
                  name="maxSalary"
                  value={formData.maxSalary || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-white mb-2">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription || ''}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
            </div>

            {/* Key Responsibilities */}
            <div>
              <label htmlFor="keyResponsibilities" className="block text-sm font-medium text-white mb-2">
                Key Responsibilities
              </label>
              <textarea
                id="keyResponsibilities"
                name="keyResponsibilities"
                value={formData.keyResponsibilities || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
                placeholder="Enter each responsibility on a new line"
              />
            </div>

            {/* Requirements & Qualifications */}
            <div>
              <label htmlFor="requirementsQualifications" className="block text-sm font-medium text-white mb-2">
                Requirements & Qualifications
              </label>
              <textarea
                id="requirementsQualifications"
                name="requirementsQualifications"
                value={formData.requirementsQualifications || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
                placeholder="Enter each requirement on a new line"
              />
            </div>

            {/* Benefits & Perks */}
            <div>
              <label htmlFor="benefitsPerks" className="block text-sm font-medium text-white mb-2">
                Benefits & Perks
              </label>
              <textarea
                id="benefitsPerks"
                name="benefitsPerks"
                value={formData.benefitsPerks || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Enter each benefit on a new line"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-white mb-2">
                Required Skills
              </label>
              <TagInput
                tags={formData.requiredSkills || []}
                onChange={(skills) => setFormData(prev => ({ ...prev, requiredSkills: skills }))}
                placeholder="Type a skill and press Enter..."
                className="focus-within:ring-2 focus-within:ring-indigo-500/50"
              />
              <p className="mt-2 text-xs text-white/40">
                Press Enter or comma to add a skill. Click × to remove a skill.
              </p>
            </div>

            {/* Application Deadline */}
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-white mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                id="applicationDeadline"
                name="applicationDeadline"
                value={formData.applicationDeadline || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}