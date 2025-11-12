// Candidate type definitions

export type CandidateAvailability = 'immediate' | '2-weeks' | '1-month' | 'not-looking'

export type CandidateApplicationStatus =
	| 'pending'
	| 'reviewing'
	| 'shortlisted'
	| 'interviewing'
	| 'offer'
	| 'rejected'
	| 'hired'
	| 'withdrawn'

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'

export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead'

export interface CandidateMatchScores {
	overallScore?: number
	skillsMatch?: number
	experienceMatch?: number
	educationMatch?: number
}

export interface CandidateApplication {
	id: string
	jobId: string
	jobTitle: string
	status: CandidateApplicationStatus
	appliedAt: string
	matchScores?: CandidateMatchScores
	resumeUrl?: string
	coverLetter?: string
}

export interface CandidateContact {
	phone?: string
	email?: string
	linkedin?: string
	github?: string
	website?: string
	portfolio?: string
}

export interface CandidateWorkExperience {
	id: string
	role: string
	company: string
	location?: string
	startDate: string
	endDate?: string
	isCurrent: boolean
	summary?: string
	achievements?: string[]
}

export interface CandidateEducation {
	id: string
	school: string
	degree: string
	fieldOfStudy?: string
	location?: string
	startDate?: string
	endDate?: string
	gpa?: number
}

export interface CandidateCertification {
	id: string
	name: string
	issuer: string
	date: string
	credentialId?: string
	expirationDate?: string
}

export interface CandidateProject {
	id: string
	name: string
	description?: string
	link?: string
	technologies?: string[]
	startDate?: string
	endDate?: string
}

// For list view (candidate card)
export interface CandidateListItem {
	id: string
	fullName: string
	email: string
	currentRole?: string
	headline?: string
	location?: string
	avatarUrl?: string
	summary?: string
	skills?: string[]
	topSkills?: string[]
	yearsOfExperience?: number
	experienceYears?: number
	experienceLevel?: ExperienceLevel
	availability?: CandidateAvailability
	openToRemote?: boolean
	preferredJobTypes?: JobType[]
	expectedSalaryMin?: number
	expectedSalaryMax?: number
	currency?: string
	isBookmarked?: boolean
	matchScores?: CandidateMatchScores
	applications?: CandidateApplication[]
	degreeSummary?: string
	educationSummary?: string
	lastActive: string
}

// For detail view (full profile)
export interface CandidateProfile extends CandidateListItem {
	contact?: CandidateContact
	workExperience?: CandidateWorkExperience[]
	education?: CandidateEducation[]
	certifications?: CandidateCertification[]
	projects?: CandidateProject[]
	resumeUrl?: string
}

// Pagination metadata
export interface CandidateListMeta {
	totalCount: number
	page: number
	pageSize: number
	totalPages: number
	hasNext: boolean
	hasPrev: boolean
}

// API Response types
export interface CandidatesListResponse {
	candidates: CandidateListItem[]
	meta: CandidateListMeta
}

export interface CandidateDetailResponse {
	candidate: CandidateProfile
}

