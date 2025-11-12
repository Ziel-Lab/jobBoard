'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
	ArrowLeft,
	MapPin,
	Mail,
	Phone,
	Globe,
	Linkedin,
	Github,
	Calendar,
	Briefcase,
	GraduationCap,
	Code,
	Award,
	FileText,
	Download,
	BookmarkCheck,
	Bookmark,
	Send,
	Building,
	TrendingUp,
} from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { candidatesApi } from '@/lib/candidates-api'
import type { CandidateProfile } from '@/types/candidate'

export default function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter()
	const [candidate, setCandidate] = useState<CandidateProfile | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [isBookmarked, setIsBookmarked] = useState(false)
	const [applicationId, setApplicationId] = useState<string | null>(null)

	useEffect(() => {
		// Unwrap params Promise
		params.then(({ id }) => {
			setApplicationId(id)
		})
	}, [params])

	useEffect(() => {
		if (!applicationId) return

		const fetchCandidate = async () => {
			try {
				setIsLoading(true)
				setHasError(false)
				setErrorMessage('')

				// The application ID is used to fetch the candidate profile
				const { candidate: data, error } = await candidatesApi.getCandidate(applicationId)
				
				if (error) {
					console.error('Error fetching candidate:', error)
					setHasError(true)
					setErrorMessage(error.message || 'Failed to load candidate')
				} else if (data) {
					setCandidate(data)
					setIsBookmarked(data.isBookmarked || false)
				} else {
					setHasError(true)
					setErrorMessage('Candidate not found')
				}
			} catch (error) {
				console.error('Error fetching candidate:', error)
				setHasError(true)
				setErrorMessage('An unexpected error occurred')
			} finally {
				setIsLoading(false)
			}
		}

		fetchCandidate()
	}, [applicationId])

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
		})
	}

	const getStatusBadge = (status: string) => {
		const styles: Record<string, string> = {
			pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
			reviewing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
			shortlisted: 'bg-green-500/20 text-green-300 border-green-500/30',
			rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
			interviewing: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
			offer: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
			hired: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
			withdrawn: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
		}

		return (
			<span className={`px-2 py-1 text-xs font-semibold rounded-full border ${styles[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
				{status?.charAt(0).toUpperCase() + status?.slice(1)}
			</span>
		)
	}

	const getScoreColor = (score?: number) => {
		if (!score) return 'text-gray-400'
		if (score >= 80) return 'text-green-400'
		if (score >= 60) return 'text-blue-400'
		if (score >= 40) return 'text-orange-400'
		return 'text-red-400'
	}

	// Loading state
	if (isLoading) {
		return (
			<main className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
				<LoadingSpinner />
			</main>
		)
	}

	// Error state
	if (hasError || !candidate) {
		return (
			<main className="min-h-screen bg-black relative overflow-hidden">
				<div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8">
					<div className="text-center py-16">
						<h1 className="text-2xl font-bold text-white mb-4">Candidate Not Found</h1>
						<p className="text-white/60 mb-6">
							{errorMessage || "The candidate profile you're looking for doesn't exist or couldn't be loaded."}
						</p>
						<Link
							href="/employer/candidates"
							className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Candidates
						</Link>
					</div>
				</div>
			</main>
		)
	}

	return (
		<main className="min-h-screen bg-black relative overflow-hidden">
			{/* Ambient light effects */}
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

			<div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8">
				{/* Back Button */}
				<button
					onClick={() => router.back()}
					className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Candidates
				</button>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Profile Overview */}
					<div className="lg:col-span-1 space-y-6">
						{/* Profile Card */}
						<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
						{/* Avatar */}
						<div className="flex justify-center mb-4">
							{candidate.avatarUrl ? (
								<Image
									src={candidate.avatarUrl}
									alt={candidate.fullName}
									width={128}
									height={128}
									className="w-32 h-32 rounded-full object-cover"
								/>
							) : (
								<div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
									<span className="text-white font-bold text-4xl">
										{getInitials(candidate.fullName)}
									</span>
								</div>
							)}
						</div>

							{/* Name and Location */}
							<div className="text-center mb-6">
								<h1 className="text-2xl font-bold text-white mb-2">{candidate.fullName}</h1>
								{candidate.currentRole && (
									<p className="text-indigo-300 font-medium mb-2">{candidate.currentRole}</p>
								)}
								{candidate.location && (
									<div className="flex items-center justify-center gap-1 text-white/60 mb-2">
										<MapPin className="w-4 h-4" />
										<span>{candidate.location}</span>
									</div>
								)}
								{candidate.experienceYears !== undefined && (
									<p className="text-white/70 text-sm">
										{candidate.experienceYears} years of experience
									</p>
								)}
							</div>

							{/* Contact Info */}
							<div className="space-y-3 mb-6 pb-6 border-b border-white/10">
								{candidate.email && (
									<a
										href={`mailto:${candidate.email}`}
										className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
									>
										<Mail className="w-4 h-4" />
										<span className="text-sm">{candidate.email}</span>
									</a>
								)}
								{candidate.contact?.phone && (
									<a
										href={`tel:${candidate.contact.phone}`}
										className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
									>
										<Phone className="w-4 h-4" />
										<span className="text-sm">{candidate.contact.phone}</span>
									</a>
								)}
								{(candidate.contact?.website || candidate.contact?.portfolio) && (
									<a
										href={candidate.contact?.website || candidate.contact?.portfolio}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
									>
										<Globe className="w-4 h-4" />
										<span className="text-sm truncate">Portfolio</span>
									</a>
								)}
							</div>

							{/* Social Links */}
							{(candidate.contact?.linkedin || candidate.contact?.github) && (
								<div className="flex gap-2 mb-6 pb-6 border-b border-white/10">
									{candidate.contact?.linkedin && (
										<a
											href={candidate.contact.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg transition-colors"
										>
											<Linkedin className="w-4 h-4" />
										</a>
									)}
									{candidate.contact?.github && (
										<a
											href={candidate.contact.github}
											target="_blank"
											rel="noopener noreferrer"
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-600/30 rounded-lg transition-colors"
										>
											<Github className="w-4 h-4" />
										</a>
									)}
								</div>
							)}

							{/* Action Buttons */}
							<div className="space-y-2">
								<button
									onClick={() => setIsBookmarked(!isBookmarked)}
									className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold ${
										isBookmarked
											? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
											: 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
									}`}
								>
									{isBookmarked ? (
										<>
											<BookmarkCheck className="w-5 h-5" />
											Saved
										</>
									) : (
										<>
											<Bookmark className="w-5 h-5" />
											Save Candidate
										</>
									)}
								</button>
								{candidate.email && (
									<a
										href={`mailto:${candidate.email}`}
										className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
									>
										<Send className="w-5 h-5" />
										Send Message
									</a>
								)}
								{candidate.resumeUrl && (
									<a
										href={candidate.resumeUrl}
										download
										className="w-full px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/30 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
									>
										<Download className="w-5 h-5" />
										Download Resume
									</a>
								)}
							</div>
						</div>
					</div>

					{/* Right Column - Detailed Information */}
					<div className="lg:col-span-2 space-y-6">
						{/* Applications */}
						{candidate.applications && candidate.applications.length > 0 && (
							<div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl p-6">
								<div className="flex items-center gap-2 mb-4">
									<Briefcase className="w-5 h-5 text-indigo-400" />
									<h2 className="text-xl font-bold text-white">
										Applications ({candidate.applications.length})
									</h2>
								</div>
								<div className="space-y-3">
									{candidate.applications.map((app) => (
										<div
											key={app.id}
											className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
										>
											<div className="flex items-start justify-between gap-4 mb-2">
												<div className="flex-1">
													<h3 className="text-white font-semibold mb-1">
														{app.jobTitle}
													</h3>
													<p className="text-white/60 text-sm flex items-center gap-1">
														<Calendar className="w-3.5 h-3.5" />
														Applied on{' '}
														{new Date(app.appliedAt).toLocaleDateString('en-US', {
															month: 'short',
															day: 'numeric',
															year: 'numeric',
														})}
													</p>
												</div>
												{getStatusBadge(app.status)}
											</div>
											{/* Match Scores */}
											{app.matchScores && (
												<div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
													{app.matchScores.overallScore !== undefined && (
														<div className="text-xs">
															<span className="text-white/60">Overall: </span>
															<span className={`font-semibold ${getScoreColor(app.matchScores.overallScore)}`}>
																{app.matchScores.overallScore}%
															</span>
														</div>
													)}
													{app.matchScores.skillsMatch !== undefined && (
														<div className="text-xs">
															<span className="text-white/60">Skills: </span>
															<span className={`font-semibold ${getScoreColor(app.matchScores.skillsMatch)}`}>
																{app.matchScores.skillsMatch}%
															</span>
														</div>
													)}
													{app.matchScores.experienceMatch !== undefined && (
														<div className="text-xs">
															<span className="text-white/60">Exp: </span>
															<span className={`font-semibold ${getScoreColor(app.matchScores.experienceMatch)}`}>
																{app.matchScores.experienceMatch}%
															</span>
														</div>
													)}
													{app.matchScores.educationMatch !== undefined && (
														<div className="text-xs">
															<span className="text-white/60">Edu: </span>
															<span className={`font-semibold ${getScoreColor(app.matchScores.educationMatch)}`}>
																{app.matchScores.educationMatch}%
															</span>
														</div>
													)}
												</div>
											)}
											<Link
												href={`/employer/jobs/${app.jobId}`}
												className="text-indigo-400 hover:text-indigo-300 text-sm font-medium inline-flex items-center gap-1 mt-2"
											>
												View Job Details
												<TrendingUp className="w-3.5 h-3.5" />
											</Link>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Summary */}
						{candidate.summary && (
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
								<div className="flex items-center gap-2 mb-4">
									<FileText className="w-5 h-5 text-indigo-400" />
									<h2 className="text-xl font-bold text-white">Summary</h2>
								</div>
								<p className="text-white/80 leading-relaxed whitespace-pre-wrap">{candidate.summary}</p>
							</div>
						)}

						{/* Skills */}
						{candidate.skills && candidate.skills.length > 0 && (
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
								<div className="flex items-center gap-2 mb-4">
									<Code className="w-5 h-5 text-indigo-400" />
									<h2 className="text-xl font-bold text-white">Skills & Expertise</h2>
								</div>
								<div className="flex flex-wrap gap-2">
									{candidate.skills.map((skill, index) => (
										<span
											key={index}
											className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/10 border border-white/20 rounded-full hover:bg-white/15 transition-colors"
										>
											{skill}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Experience */}
						{candidate.workExperience && candidate.workExperience.length > 0 && (
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
								<div className="flex items-center gap-2 mb-6">
									<Briefcase className="w-5 h-5 text-indigo-400" />
									<h2 className="text-xl font-bold text-white">Work Experience</h2>
								</div>
								<div className="space-y-6">
									{candidate.workExperience.map((exp, index) => (
										<div
											key={exp.id}
											className={`${index !== candidate.workExperience!.length - 1 ? 'pb-6 border-b border-white/10' : ''}`}
										>
											<div className="flex items-start gap-4">
												<div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
													<Building className="w-6 h-6 text-indigo-400" />
												</div>
												<div className="flex-1">
													<h3 className="text-lg font-semibold text-white mb-1">
														{exp.role}
													</h3>
													<p className="text-indigo-300 font-medium mb-2">
														{exp.company}
													</p>
													<div className="flex flex-wrap items-center gap-3 text-sm text-white/60 mb-3">
														{exp.location && (
															<span className="flex items-center gap-1">
																<MapPin className="w-3.5 h-3.5" />
																{exp.location}
															</span>
														)}
														<span className="flex items-center gap-1">
															<Calendar className="w-3.5 h-3.5" />
															{formatDate(exp.startDate)} -{' '}
															{exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'Present'}
														</span>
													</div>
													{exp.summary && (
														<p className="text-white/70 text-sm mb-3">{exp.summary}</p>
													)}
													{exp.achievements && exp.achievements.length > 0 && (
														<ul className="space-y-2">
															{exp.achievements.map((achievement, idx) => (
																<li
																	key={idx}
																	className="text-white/70 text-sm flex gap-2"
																>
																	<span className="text-indigo-400 mt-1.5">•</span>
																	<span>{achievement}</span>
																</li>
															))}
														</ul>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Education */}
						{candidate.education && candidate.education.length > 0 && (
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
								<div className="flex items-center gap-2 mb-6">
									<GraduationCap className="w-5 h-5 text-indigo-400" />
									<h2 className="text-xl font-bold text-white">Education</h2>
								</div>
								<div className="space-y-4">
									{candidate.education.map((edu) => (
										<div
											key={edu.id}
											className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg"
										>
											<div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
												<GraduationCap className="w-5 h-5 text-emerald-400" />
											</div>
											<div className="flex-1">
												<h3 className="text-white font-semibold mb-1">{edu.school}</h3>
												<p className="text-white/80 text-sm mb-1">
													{edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
												</p>
												<div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
													{edu.location && (
														<span className="flex items-center gap-1">
															<MapPin className="w-3 h-3" />
															{edu.location}
														</span>
													)}
													{edu.startDate && (
														<span className="flex items-center gap-1">
															<Calendar className="w-3 h-3" />
															{formatDate(edu.startDate)} -{' '}
															{edu.endDate ? formatDate(edu.endDate) : 'Present'}
														</span>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Certifications */}
						{candidate.certifications && candidate.certifications.length > 0 && (
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
								<div className="flex items-center gap-2 mb-6">
									<Award className="w-5 h-5 text-indigo-400" />
									<h2 className="text-xl font-bold text-white">
										Certifications & Credentials
									</h2>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{candidate.certifications.map((cert) => (
										<div
											key={cert.id}
											className="p-4 bg-white/5 border border-white/10 rounded-lg"
										>
											<h3 className="text-white font-semibold mb-2">{cert.name}</h3>
											<p className="text-white/70 text-sm mb-1">{cert.issuer}</p>
											<p className="text-white/50 text-xs flex items-center gap-1">
												<Calendar className="w-3 h-3" />
												{formatDate(cert.date)}
											</p>
											{cert.credentialId && (
												<p className="text-white/40 text-xs mt-2">
													ID: {cert.credentialId}
												</p>
											)}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Projects */}
						{candidate.projects && candidate.projects.length > 0 && (
							<div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
								<div className="flex items-center gap-2 mb-6">
									<Code className="w-5 h-5 text-indigo-400" />
									<h2 className="text-xl font-bold text-white">Projects</h2>
								</div>
								<div className="space-y-4">
									{candidate.projects.map((project) => (
										<div
											key={project.id}
											className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
										>
											<div className="flex items-start justify-between gap-4 mb-2">
												<h3 className="text-white font-semibold">{project.name}</h3>
												{project.link && (
													<a
														href={project.link}
														target="_blank"
														rel="noopener noreferrer"
														className="text-indigo-400 hover:text-indigo-300 transition-colors flex-shrink-0"
													>
														<Globe className="w-4 h-4" />
													</a>
												)}
											</div>
											{project.description && (
												<p className="text-white/70 text-sm mb-3">
													{project.description}
												</p>
											)}
											{project.technologies && project.technologies.length > 0 && (
												<div className="flex flex-wrap gap-1.5">
													{project.technologies.map((tech, techIndex) => (
														<span
															key={techIndex}
															className="px-2 py-1 text-xs font-medium text-white/70 bg-white/5 border border-white/15 rounded-full"
														>
															{tech}
														</span>
													))}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	)
}
