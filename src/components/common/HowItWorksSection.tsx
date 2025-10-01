'use client'

import React from 'react'
import SpotlightCard from '../ui/SpotlightCard'
import { HiArrowRight } from "react-icons/hi";

interface StepItem {
	num: number
	title: string
	description: string
}

const steps: StepItem[] = [
	{
		num: 1,
		title: 'Post & Promote',
		description:
			'Publish to your branded careers site and push to Indeed, LinkedIn, and Glassdoor in one click.'
	},
	{
		num: 2,
		title: 'Parse, Score & Screen',
		description:
			'Hulo turns resumes + cover letters into structured profiles. Our ATS scoring ranks candidates against your must‑haves. Passing candidates automatically receive an AI mock interview—no scheduling.'
	},
	{
		num: 3,
		title: 'Decide & Offer',
		description:
			'You get transcripts, summaries, and recommendations. Move top candidates through your pipeline, schedule human rounds, and send offers with e‑signatures.'
	}
]

const HowItWorksSection: React.FC = () => {
	return (
		<section className="w-full py-14 px-4 sm:px-6">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-12">
					How Hulo works
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{steps.map(step => {
						const color =
							step.num === 1
								? 'rgba(59, 130, 246, 0.5)'
								: step.num === 2
								? 'rgba(59, 130, 246, 0.5)'
								: 'rgba(59, 130, 246, 0.5)'

						return (
							<SpotlightCard key={step.num} className="p-8 text-center h-full" spotlightColor={color as `rgba(${number}, ${number}, ${number}, ${number})`}>
								<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white font-semibold">
									{step.num}
								</div>
								<h3 className="text-white text-lg font-semibold mb-3">
									{step.title}
								</h3>
								<p className="text-white/80 leading-relaxed">
									{step.description}
								</p>
							</SpotlightCard>
						)
					})}
					
				</div>
				<div className="mt-10 w-full flex justify-center">
					<button
						className="rounded-full px-6 py-3 text-sm font-semibold text-white/90 border border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-[inset_0_2px_0_rgba(255,255,255,0.15),0_0_25px_rgba(255,255,255,0.15),0_0_50px_rgba(255,255,255,0.08),0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2px_0_rgba(255,255,255,0.25),0_0_35px_rgba(255,255,255,0.25),0_0_70px_rgba(255,255,255,0.15),0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300"
					>
						<span className='flex flex-row items-center'>
							See a candidate Summary {" "}<HiArrowRight className='ml-2 mt-1'/>
						</span>
					</button>
				</div>
			</div>
			
		</section>
	)
}

export default HowItWorksSection


