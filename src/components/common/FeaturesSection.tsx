'use client'

import React from 'react'
import  { GlassIconsItem } from '../ui/GlassIcons'


const FeaturesSection: React.FC = () => {
	const features: GlassIconsItem[] = [
		{
			icon: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-white"
				>
					<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
				</svg>
			),
			color: 'blue',
			label: 'AI-vetted, interview-ready'
		},
		{
			icon: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-white"
				>
					<circle cx="12" cy="12" r="10" />
					<circle cx="12" cy="12" r="6" />
					<circle cx="12" cy="12" r="2" />
				</svg>
			),
			color: 'purple',
			label: 'Simple, not stripped down'
		},
		{
			icon: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-white"
				>
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			),
			color: 'green',
			label: 'Built for lean teams'
		},
		{
			icon: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-white"
				>
					<path d="M3 3v18h18" />
					<path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
				</svg>
			),
			color: 'orange',
			label: 'Faster time-to-hire'
		}
	]

	return (
		<section className="w-full lg:py-10 px-4 sm:px-6">
			{/* Background gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none" />
			
			<div className="relative z-10 max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-6">
						Stop managing applicants.{' '}
						<span 
						 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
							Start meeting the right ones.	
						</span>
					</h2>
					<p className="text-sm sm:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
						Legacy ATS tools collect resumes and create admin. Hulo vets candidates and removes friction.
					</p>
				</div>
					<br/>
				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{features.map((feature, index) => (
						<div
							key={index}
							className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
						>
							{/* Glass icon */}
							<div className="flex justify-center mb-6">
								<div className="relative bg-transparent outline-none w-16 h-16 [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group-hover:scale-110 transition-transform duration-300">
									<span
										className="absolute top-0 left-0 w-full h-full rounded-2xl block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
										style={{
											background: feature.color === 'blue' 
												? 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))'
												: feature.color === 'purple'
												? 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))'
												: feature.color === 'green'
												? 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
												: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
											boxShadow: '0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)'
										}}
									></span>
									<span
										className="absolute top-0 left-0 w-full h-full rounded-2xl bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] transform group-hover:[transform:translateZ(2em)]"
										style={{
											boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset'
										}}
									>
										<span className="m-auto w-6 h-6 flex items-center justify-center" aria-hidden="true">
											{feature.icon}
										</span>
									</span>
								</div>
							</div>

							{/* Content */}
							<div className="text-center">
								<h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
									{feature.label}
								</h3>
								<p className="text-sm text-white/70 leading-relaxed">
									{index === 0 && "Every resume becomes a structured profile. Candidates are scored against your requirements and auto-invited to an AI first-round interview when they pass your threshold."}
									{index === 1 && "Job posts, syndication, pipeline, scheduling, offers with e-sign, analytics. Everything you need; nothing you don't."}
									{index === 2 && "Clear workflows, zero training curve, role-based access. Hiring managers actually use it."}
									{index === 3 && "Teams report up to 60% less screening time and 40% faster hires."}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default FeaturesSection
