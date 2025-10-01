'use client'

import React from 'react'
import { FiZap, FiTarget, FiClock, FiExternalLink } from 'react-icons/fi'
import ShinyText from '../ui/ShinyText'

interface DifferentiatorItem {
	icon: React.ReactNode
	title: string
	description: string
}

const DifferentiatorsSection: React.FC = () => {
	const items: DifferentiatorItem[] = [
		{
			icon: (
				<span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-300">
					<FiZap className="w-7 h-7" />
				</span>
			),
			title: 'Vetted, not just tracked',
			description: 'Hulo does the first interview for you.'
		},
		{
			icon: (
				<span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-300">
					<FiTarget className="w-7 h-7" />
				</span>
			),
			title: 'Simple but complete',
			description: 'All the essentials, no enterprise bloat.'
		},
		{
			icon: (
				<span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 text-purple-300">
					<FiClock className="w-7 h-7" />
				</span>
			),
			title: 'Fast setup',
			description:
				'Go live in minutes. Bring your jobs and candidates with CSV import.'
		},
		{
			icon: (
				<span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-300">
					<FiExternalLink className="w-7 h-7" />
				</span>
			),
			title: 'Plug into your stack',
			description:
				'Job boards, calendars (Google/Microsoft), assessments, e‑sign. Use what you already have.'
		}
	]

	return (
		<section className="w-full  mt-10 py-12 px-4 sm:px-6">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-20">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
						What makes Hulo different
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					{items.map((item, idx) => (
						<div key={idx} className="text-center">
							<div className="flex justify-center mb-5">{item.icon}</div>
							<h3 className="text-white text-lg font-semibold mb-3">
								{item.title}
							</h3>
							<p className="text-white/75 max-w-[22rem] mx-auto leading-relaxed">
								{item.description}
							</p>
						</div>
					))}
				</div>

				<div className="mt-12 flex justify-center">
					<button
            			className="rounded-full px-6 py-3 text-sm font-semibold text-neutral-900 border border-white/60 shadow-[inset_0_2px_0_rgba(255,255,255,0.9),0_6px_12px_rgba(0,0,0,0.4)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/40"
          			>
            			Book Demo
          			</button>
				</div>
			</div>
		</section>
	)
}

export default DifferentiatorsSection


