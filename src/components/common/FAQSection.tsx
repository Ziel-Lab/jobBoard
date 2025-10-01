'use client'

import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

interface FaqItem {
	q: string
	a: string
}

const data: FaqItem[] = [
	{
		q: 'Will AI reject great candidates?',
		a:
			"No. AI handles the first-round screen and flags strong profiles with transparent reasons. Recruiters always have final control and can override or adjust thresholds."
	},
	{
		q: 'Can we use our existing calendars and assessments?',
		a:
			"Yes. Connect Google or Microsoft calendars for scheduling and plug in your preferred assessments and e‑sign. Keep the tools your team already uses."
	},
	{
		q: 'Is this only for startups?',
		a:
			"No. Teams of all sizes use Hulo. Lightweight for lean teams, robust enough for growing organizations with role‑based access and clear workflows."
	}
]

const FAQSection: React.FC = () => {
	const [open, setOpen] = useState<number | null>(0)

	return (
		<section className="w-full py-14 px-4 sm:px-6">
			<div className="max-w-5xl mx-auto">
				<h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-10">
					FAQs
				</h2>

				<div className="divide-y divide-white/10 rounded-2xl border border-white/10 overflow-hidden bg-white/5">
					{data.map((item, idx) => {
						const isOpen = open === idx
						return (
							<div key={idx}>
								<button
									onClick={() => setOpen(isOpen ? null : idx)}
									className="w-full flex items-center justify-between text-left px-6 py-5 focus:outline-none"
									aria-expanded={isOpen}
									aria-controls={`faq-panel-${idx}`}
								>
									<span className="text-white text-base sm:text-lg font-medium">
										{item.q}
									</span>
									<FiChevronDown
										className={`ml-4 h-5 w-5 text-white/70 transition-transform ${
											isOpen ? 'rotate-180' : ''
										}`}
									/>
								</button>
								<div
									id={`faq-panel-${idx}`}
									className={`px-6 pb-6 text-white/80 transition-[max-height,opacity] duration-300 ease-in-out ${
										isOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
									}`}
									aria-hidden={!isOpen}
								>
									{item.a}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default FAQSection


