'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import ApplicationForm, { ApplicationFormData } from './application-form'

interface ApplyButtonProps {
    jobId: string
    jobTitle: string
    companyName?: string
    primaryColor: string
    className?: string
}

export default function ApplyButton({ jobId, jobTitle, companyName, primaryColor, className = '' }: ApplyButtonProps) {
    const [showApplicationForm, setShowApplicationForm] = useState(false)

    const handleApplicationSubmit = async (formData: ApplicationFormData) => {
        try {
            // Create FormData object to handle file upload
            const form = new FormData()
            form.append('resume', formData.resume)
            form.append('data', JSON.stringify({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                coverLetter: formData.coverLetter,
                linkedinUrl: formData.linkedinUrl,
                portfolioUrl: formData.portfolioUrl
            }))

            const response = await fetch(`/api/jobs/${jobId}/apply`, {
                method: 'POST',
                body: form,
            })

            if (!response.ok) {
                throw new Error('Failed to submit application')
            }

            // Show success message or handle success case
            alert('Application submitted successfully!')
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to submit application. Please try again.')
            throw error
        }
    }

    return (
        <>
            <button 
                onClick={() => setShowApplicationForm(true)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-white ${className}`}
                style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
                }}
            >
                <span>Apply Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
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