'use client'

import React from 'react'
import SpotlightCard from '../ui/SpotlightCard'
import {
	FiFileText,
	FiMessageSquare,
	FiUsers,
	FiStar,
	FiEdit3,
	FiBarChart2,
	FiCheckCircle
} from 'react-icons/fi'

type SpotlightColor = `rgba(${number}, ${number}, ${number}, ${number})`

interface CapabilityItem {
	icon: React.ReactNode
	title: string
	points: string[]
	spotlight?: SpotlightColor
}

const checkIcon = (
	<FiCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
)

const CapabilitiesSection: React.FC = () => {
	const items: CapabilityItem[] = [
		{
			icon: (
				<span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-300">
					<FiFileText className="w-6 h-6" />
				</span>
			),
			title: 'Candidate Intelligence',
			points: [
				'Structured profiles from resumes and cover letters',
				'ATS scoring you control (set the threshold per job)',
				'Explainable reasons: skills matched, gaps, confidence',
				'Dupe detection and merge'
			],
			spotlight: 'rgba(59, 130, 246, 0.6)' as SpotlightColor
		},
		{
			icon: (
				<span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-300">
					<FiMessageSquare className="w-6 h-6" />
				</span>
			),
			title: 'AI Mock Interviews',
			points: [
				'Role-based question sets (behavioral + technical)',
				'24/7 screening, instant transcripts and summaries',
				'Consistent scoring rubrics, bias guardrails and redaction',
				'Auto-advance rules to the next stage'
			],
			spotlight: 'rgba(16, 185, 129, 0.6)' as SpotlightColor
		},
		{
			icon: (
				<span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-300">
					<FiUsers className="w-6 h-6" />
				</span>
			),
			title: 'Simple Team Hiring',
			points: [
				'Kanban pipeline with drag-and-drop',
				'Interview kits and scorecards',
				'Notes, @mentions, and auto-alerts',
				'Role-based access for recruiters, managers, interviewers'
			],
			spotlight: 'rgba(168, 85, 247, 0.6)' as SpotlightColor
		},
		{
			icon: (
				<span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-300">
					<FiStar className="w-6 h-6" />
				</span>
			),
			title: 'Candidate Experience',
			points: [
				'Status updates and self-serve scheduling',
				'Branded careers page on your domain (e.g., `acme.hulo.com`)',
				'Clear communication at every step, template emails'
			],
			spotlight: 'rgba(245, 158, 11, 0.6)' as SpotlightColor
		},
		{
			icon: (
				<span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 text-rose-300">
					<FiEdit3 className="w-6 h-6" />
				</span>
			),
			title: 'Offers & E-Signatures',
			points: [
				'Custom templates per role/level',
				'Auto-populate candidate and job details',
				'One-click e-sign, instant audit trail'
			],
			spotlight: 'rgba(244, 63, 94, 0.6)' as SpotlightColor
		},
		{
			icon: (
				<span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-300">
					<FiBarChart2 className="w-6 h-6" />
				</span>
			),
			title: 'Reporting that matters',
			points: [
				'Source quality, funnel conversion, time-to-hire',
				'Stage aging and SLA alerts',
				'Export to CSV, weekly hiring ops digest'
			],
			spotlight: 'rgba(99, 102, 241,0.6)' as SpotlightColor
		}
	]

	return (
		<section className="w-full mt-6 py-10 px-4 sm:px-6">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-10">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white lg: mb-16">
						Everything you need to hire better
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{items.map((item, idx) => (
						<SpotlightCard
							key={idx}
							className="bg-neutral-900/80 hover:bg-neutral-900"
							spotlightColor={item.spotlight}
						>
							<div className="flex items-start gap-4">
								{item.icon}
								<div>
									<h3 className="text-white text-lg font-semibold mb-3">
										{item.title}
									</h3>
									<ul className="space-y-3">
										{item.points.map((p, i) => (
											<li key={i} className="flex items-start gap-2 text-white/80">
												{checkIcon}
												<span className="leading-relaxed">
													{p}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</SpotlightCard>
					))}
				</div>
			</div>
		</section>
	)
}

export default CapabilitiesSection


