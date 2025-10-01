'use client'

import React from 'react'
import CountUp from '../ui/CountUp'

interface StatItem {
	label: string
	color: string
	value: number
	suffix?: string
	postfix?: string
}

const OutcomesSection: React.FC = () => {
	const stats: StatItem[] = [
		{
			value: 60,
			suffix: '%',
			label: 'less time spent on resume review',
			color: 'text-blue-400'
		},
		{
			value: 40,
			suffix: '%',
			label: 'faster time-to-hire',
			color: 'text-emerald-400'
		},
		{
			value: 8,
			postfix: '+',
			label: 'hours saved per recruiter each week',
			color: 'text-purple-400'
		},
		{
			value: 1,
			label: 'candidate satisfaction with clear, timely updates',
			color: 'text-orange-400'
		}
	]

	return (
		<section className="w-full py-14 px-4 sm:px-6">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-12">
					Outcomes & ROI
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					{stats.map((s, i) => (
						<div key={i} className="text-center">
							<div className={`font-extrabold ${s.color} text-4xl sm:text-5xl mb-3`}>
								<CountUp to={s.value} className="tabular-nums" />
								{s.suffix ? <span className="ml-1 align-baseline">{s.suffix}</span> : null}
								{s.postfix ? <span className="ml-1 align-baseline">{s.postfix}</span> : null}
							</div>
							<p className="text-white/80 leading-relaxed max-w-[18rem] mx-auto">
								{i === 3 ? 'Higher ' : ''}{s.label}
							</p>
						</div>
					))}
				</div>

				<p className="mt-12 text-center text-white/80 max-w-4xl mx-auto">
					Small teams feel bigger. Hiring managers stay engaged. Candidates get a
					better experience. Everyone wins.
				</p>
			</div>
		</section>
	)
}

export default OutcomesSection


