import { useState } from 'react'
import { MdOutlineUploadFile } from "react-icons/md";
import { MdCheckCircle, MdError } from "react-icons/md";

interface ApplicationFormProps {
    jobId: string
    jobTitle: string
    companyName?: string
    onClose: () => void
    onSubmit: (formData: ApplicationFormData) => Promise<{ success: boolean; message: string }>
}

export interface ApplicationFormData {
    fullName: string
    email: string
    phone: string
    resume: File
    coverLetter: string
    linkedinUrl?: string
    portfolioUrl?: string
}

export default function ApplicationForm({ jobTitle, companyName, onClose, onSubmit }: ApplicationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [statusMessage, setStatusMessage] = useState('')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        linkedinUrl: '',
        portfolioUrl: ''
    })
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setFileError('')

        if (!file) {
            setFileError('Please select a file')
            return
        }

        // Check file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!allowedTypes.includes(file.type)) {
            setFileError('Please upload a PDF or Word document')
            return
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setFileError('File size must be less than 5MB')
            return
        }

        setResumeFile(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!resumeFile) {
            setFileError('Please upload your resume')
            return
        }

        setIsSubmitting(true)
        setSubmitStatus('idle')
        setStatusMessage('')
        
        try {
            const submitData: ApplicationFormData = {
                ...formData,
                resume: resumeFile
            }
            const result = await onSubmit(submitData)
            
            setSubmitStatus('success')
            setStatusMessage(result.message || 'Application submitted successfully!')
            
            // Close the form after a short delay to show success message
            setTimeout(() => {
                onClose()
            }, 2000)
        } catch (error) {
            setSubmitStatus('error')
            setStatusMessage(
                error instanceof Error 
                    ? error.message 
                    : 'Failed to submit application. Please try again.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]">
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-start sm:items-center justify-center p-0 sm:p-4">
                    <div className="relative w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:rounded-3xl bg-black/90 border-y sm:border border-white/10">
                        {/* Subtle Pattern Overlay */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden sm:rounded-3xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12" />
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-white/3 to-transparent rounded-full blur-3xl" />
                        </div>

                        <div className="relative p-4 sm:p-8">
                            <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8">
                                <div>
                                    <h2 className="text-lg sm:text-2xl font-bold text-white pr-8">Apply for {jobTitle}</h2>
                                    {companyName && (
                                        <p className="text-sm text-white/70 mt-1">at {companyName}</p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white/70 hover:text-white transition-colors p-1"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/20"
                            />
                        </div>

                            <div>
                                <label htmlFor="resume" className="block text-sm font-medium text-white/90 mb-2">
                                    Resume Upload *
                                </label>
                                <div className="mt-1 flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="relative flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-white transition-all duration-200">
                                            <input
                                                type="file"
                                                id="resume"
                                                name="resume"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="sr-only"
                                                required
                                            />
                                            <div className="flex items-center gap-2">
                                                <MdOutlineUploadFile className='w-5 h-5' />
                                                <span>
                                                    {resumeFile ? resumeFile.name : 'Click to upload resume'}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                {fileError && (
                                    <p className="mt-2 text-sm text-red-400">{fileError}</p>
                                )}
                                <p className="mt-2 text-sm text-white/50">
                                    Maximum file size: 5MB. Supported formats: PDF, DOC, DOCX
                                </p>
                            </div>                        <div>
                            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-white/90 mb-2">
                                LinkedIn Profile URL or Portfolio URL <span className="text-white/50">(Optional)</span>
                            </label>
                            <input
                                type="url"
                                id="linkedinUrl"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/20"
                            />
                        </div>

                        {/* <div>
                            <label htmlFor="portfolioUrl" className="block text-sm font-medium text-white/90 mb-2">
                                Portfolio URL <span className="text-white/50">(Optional)</span>
                            </label>
                            <input
                                type="url"
                                id="portfolioUrl"
                                name="portfolioUrl"
                                value={formData.portfolioUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/20"
                            />
                        </div> */}

                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-white/90 mb-2">
                                Cover Letter *
                            </label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                required
                                value={formData.coverLetter}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/20"
                                placeholder="Tell us why you're interested in this position..."
                            />
                        </div>

                        {/* Status Message */}
                        {submitStatus !== 'idle' && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl ${
                                submitStatus === 'success' 
                                    ? 'bg-green-500/10 border border-green-500/20' 
                                    : 'bg-red-500/10 border border-red-500/20'
                            }`}>
                                {submitStatus === 'success' ? (
                                    <MdCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <MdError className="w-5 h-5 text-red-500 flex-shrink-0" />
                                )}
                                <p className={`text-sm ${
                                    submitStatus === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {statusMessage}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 border border-white/10 rounded-xl text-white/90 font-semibold hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitStatus === 'success' ? 'Close' : 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || submitStatus === 'success'}
                                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : submitStatus === 'success' ? (
                                    'Submitted!'
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>    
        </div>
        </div>
    )
}