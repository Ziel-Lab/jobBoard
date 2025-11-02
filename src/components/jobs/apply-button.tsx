'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import ApplicationForm, { ApplicationFormData } from './application-form'
import { uploadResume, submitApplication } from '@/lib/api'

interface ApplyButtonProps {
    jobId: string
    jobTitle: string
    companyName?: string
    primaryColor: string
    className?: string
    isAcceptingApplications?: boolean
}

export default function ApplyButton({ jobId, jobTitle, companyName, primaryColor, className = '', isAcceptingApplications = true }: ApplyButtonProps) {
    const [showApplicationForm, setShowApplicationForm] = useState(false)

    const handleApplicationSubmit = async (formData: ApplicationFormData) => {
        try {
            // Step 1: Upload resume
            const uploadResponse = await uploadResume(formData.resume)
            
            if (!uploadResponse.success || !uploadResponse.data?.resumeUrl) {
                throw new Error(uploadResponse.message || 'Failed to upload resume')
            }

            const resumeUrl = uploadResponse.data.resumeUrl

            // Step 2: Submit application with resume URL
            const submitResponse = await submitApplication({
                jobId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                resumeUrl,
                coverLetter: formData.coverLetter,
                linkedinUrl: formData.linkedinUrl,
                portfolioUrl: formData.portfolioUrl,
            })

            if (!submitResponse.success) {
                throw new Error(submitResponse.message || 'Failed to submit application')
            }

            // Application submitted successfully
            return {
                success: true,
                message: 'Application submitted successfully!'
            }
        } catch (error) {
            console.error('Application submission error:', error)
            throw error
        }
    }

    const isDisabled = !isAcceptingApplications

    return (
        <>
            <button 
                onClick={() => !isDisabled && setShowApplicationForm(true)}
                disabled={isDisabled}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 text-white ${
                    isDisabled 
                        ? 'opacity-50 cursor-not-allowed bg-gray-400' 
                        : 'shadow-lg hover:shadow-xl transform hover:scale-105'
                } ${className}`}
                style={{
                    background: isDisabled ? '#9ca3af' : `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
                }}
            >
                <span>{isDisabled ? 'Applications Closed' : 'Apply Now'}</span>
                {!isDisabled && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                )}
                {isDisabled && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </button>

            {showApplicationForm && createPortal(
                <ApplicationForm
                    jobId={jobId}
                    jobTitle={jobTitle}
                    companyName={companyName}
                    onClose={() => setShowApplicationForm(false)}
                    onSubmit={handleApplicationSubmit}
                />,
                document.body
            )}
        </>
    )
}