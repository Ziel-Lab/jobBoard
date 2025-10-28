'use client'

import { useState } from 'react'
import { jobsApi, type JobsApiError } from '@/lib/jobs-api'
import type { JobCreateInput } from '@/types/job'

interface CreateJobFormData {
	jobTitle: string
	jobDescription: string
	employmentType: 'full_time' | 'part_time' | 'contract' | 'internship'
	experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
	officeLocation: string
	isRemote: boolean
	currency: 'USD' | 'EUR' | 'GBP' | 'INR'
	minSalary: number
	maxSalary: number
	keyResponsibilities: string[]
	requirementsQualifications: string[]
	benefitsPerks: string
	requiredSkills: string[]
	applicationDeadline: string
	jobStatus: 'draft' | 'published'
}

export function CreateJobExample() {
	const [formData, setFormData] = useState<CreateJobFormData>({
		jobTitle: '',
		jobDescription: '',
		employmentType: 'full_time',
		experienceLevel: 'mid',
		officeLocation: '',
		isRemote: true,
		currency: 'USD',
		minSalary: 0,
		maxSalary: 0,
		keyResponsibilities: [''],
		requirementsQualifications: [''],
		benefitsPerks: '',
		requiredSkills: [''],
		applicationDeadline: '',
		jobStatus: 'draft'
	})

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<JobsApiError | null>(null)
	const [success, setSuccess] = useState(false)

	const handleInputChange = (field: keyof CreateJobFormData, value: string | number | boolean) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))  
		setError(null)
		setSuccess(false)
	}

	const handleArrayChange = (field: 'keyResponsibilities' | 'requirementsQualifications' | 'requiredSkills', index: number, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: prev[field].map((item, i) => i === index ? value : item)
		}))
	}

	const addArrayItem = (field: 'keyResponsibilities' | 'requirementsQualifications' | 'requiredSkills') => {
		setFormData(prev => ({
			...prev,
			[field]: [...prev[field], '']
		}))
	}

	const removeArrayItem = (field: 'keyResponsibilities' | 'requirementsQualifications' | 'requiredSkills', index: number) => {
		setFormData(prev => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index)
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		setSuccess(false)

			try {
				// Convert form data to API format
				const jobData: JobCreateInput = {
				...formData,
				keyResponsibilities: JSON.stringify(formData.keyResponsibilities.filter(item => item.trim() !== '')),
				requirementsQualifications: JSON.stringify(formData.requirementsQualifications.filter(item => item.trim() !== '')),
				requiredSkills: formData.requiredSkills.filter(item => item.trim() !== ''),
				applicationDeadline: formData.applicationDeadline || undefined
			}

			const { job, error: apiError } = await jobsApi.createJob(jobData)

			if (apiError) {
				setError(apiError)
			} else if (job) {
				setSuccess(true)
				// Reset form
				setFormData({
					jobTitle: '',
					jobDescription: '',
					employmentType: 'full_time',
					experienceLevel: 'mid',
					officeLocation: '',
					isRemote: true,
					currency: 'USD',
					minSalary: 0,
					maxSalary: 0,
					keyResponsibilities: [''],
					requirementsQualifications: [''],
					benefitsPerks: '',
					requiredSkills: [''],
					applicationDeadline: '',
					jobStatus: 'draft'
				})
			}
		} catch {
			setError({
				message: 'An unexpected error occurred',
				code: 'UNKNOWN_ERROR'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6">Create Job Posting</h2>
			
			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					<strong>Error:</strong> {error.message}
					{error.code && <span className="block text-sm">Code: {error.code}</span>}
				</div>
			)}

			{success && (
				<div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
					<strong>Success!</strong> Job created successfully.
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							Job Title *
						</label>
						<input
							type="text"
							value={formData.jobTitle}
							onChange={(e) => handleInputChange('jobTitle', e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Employment Type
						</label>
						<select
							value={formData.employmentType}
							onChange={(e) => handleInputChange('employmentType', e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
						>
							<option value="full_time">Full Time</option>
							<option value="part_time">Part Time</option>
							<option value="contract">Contract</option>
							<option value="internship">Internship</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Experience Level
						</label>
						<select
							value={formData.experienceLevel}
							onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
						>
							<option value="entry">Entry Level</option>
							<option value="mid">Mid Level</option>
							<option value="senior">Senior Level</option>
							<option value="lead">Lead</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Office Location
						</label>
						<input
							type="text"
							value={formData.officeLocation}
							onChange={(e) => handleInputChange('officeLocation', e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>
				</div>

				{/* Remote Work */}
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						id="isRemote"
						checked={formData.isRemote}
						onChange={(e) => handleInputChange('isRemote', e.target.checked)}
						className="rounded"
					/>
					<label htmlFor="isRemote" className="text-sm font-medium">
						Remote work available
					</label>
				</div>

				{/* Salary Information */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							Currency
						</label>
						<select
							value={formData.currency}
							onChange={(e) => handleInputChange('currency', e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
						>
						<option value="USD">USD</option>
						<option value="EUR">EUR</option>
						<option value="GBP">GBP</option>
						<option value="INR">INR</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Min Salary
						</label>
						<input
							type="number"
							value={formData.minSalary}
							onChange={(e) => handleInputChange('minSalary', parseInt(e.target.value) || 0)}
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Max Salary
						</label>
						<input
							type="number"
							value={formData.maxSalary}
							onChange={(e) => handleInputChange('maxSalary', parseInt(e.target.value) || 0)}
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>
				</div>

				{/* Job Description */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Job Description *
					</label>
					<textarea
						value={formData.jobDescription}
						onChange={(e) => handleInputChange('jobDescription', e.target.value)}
						rows={4}
						className="w-full p-2 border border-gray-300 rounded-md"
						required
					/>
				</div>

				{/* Key Responsibilities */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Key Responsibilities
					</label>
					{formData.keyResponsibilities.map((item, index) => (
						<div key={index} className="flex space-x-2 mb-2">
							<input
								type="text"
								value={item}
								onChange={(e) => handleArrayChange('keyResponsibilities', index, e.target.value)}
								className="flex-1 p-2 border border-gray-300 rounded-md"
								placeholder="Enter responsibility"
							/>
							<button
								type="button"
								onClick={() => removeArrayItem('keyResponsibilities', index)}
								className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
							>
								Remove
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={() => addArrayItem('keyResponsibilities')}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
					>
						Add Responsibility
					</button>
				</div>

				{/* Requirements */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Requirements & Qualifications
					</label>
					{formData.requirementsQualifications.map((item, index) => (
						<div key={index} className="flex space-x-2 mb-2">
							<input
								type="text"
								value={item}
								onChange={(e) => handleArrayChange('requirementsQualifications', index, e.target.value)}
								className="flex-1 p-2 border border-gray-300 rounded-md"
								placeholder="Enter requirement"
							/>
							<button
								type="button"
								onClick={() => removeArrayItem('requirementsQualifications', index)}
								className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
							>
								Remove
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={() => addArrayItem('requirementsQualifications')}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
					>
						Add Requirement
					</button>
				</div>

				{/* Required Skills */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Required Skills
					</label>
					{formData.requiredSkills.map((item, index) => (
						<div key={index} className="flex space-x-2 mb-2">
							<input
								type="text"
								value={item}
								onChange={(e) => handleArrayChange('requiredSkills', index, e.target.value)}
								className="flex-1 p-2 border border-gray-300 rounded-md"
								placeholder="Enter skill"
							/>
							<button
								type="button"
								onClick={() => removeArrayItem('requiredSkills', index)}
								className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
							>
								Remove
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={() => addArrayItem('requiredSkills')}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
					>
						Add Skill
					</button>
				</div>

				{/* Benefits & Perks */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Benefits & Perks
					</label>
					<textarea
						value={formData.benefitsPerks}
						onChange={(e) => handleInputChange('benefitsPerks', e.target.value)}
						rows={3}
						className="w-full p-2 border border-gray-300 rounded-md"
						placeholder="Describe benefits and perks"
					/>
				</div>

				{/* Application Deadline */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Application Deadline
					</label>
					<input
						type="datetime-local"
						value={formData.applicationDeadline}
						onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Job Status */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Job Status
					</label>
					<select
						value={formData.jobStatus}
						onChange={(e) => handleInputChange('jobStatus', e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-md"
					>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
					</select>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isLoading}
					className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? 'Creating Job...' : 'Create Job'}
				</button>
			</form>
		</div>
	)
}
