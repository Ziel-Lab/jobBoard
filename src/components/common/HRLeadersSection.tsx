'use client'

import React from 'react'
import { FiCheckCircle, FiShield } from 'react-icons/fi'

const LeftBullets = [
	'Set ATS thresholds per role.',
	'Standardize interviews with scorecards and rubrics.',
	'Keep data clean with audit logs and duplicate prevention.',
	'Prove impact with hard numbers.'
]

const RightBullets = [
	'GDPR‑friendly candidate rights (export/delete)',
	'Data residency options (EU/US), encryption at rest/in transit',
	'Role‑based access and audit trails'
]

const HRLeadersSection: React.FC = () => {
	return (
		<section className="w-full py-14 px-4 sm:px-6">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
					For HR leaders
				</h2>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h3 className="text-white text-xl font-semibold mb-4">
							Control without complexity.
						</h3>
						<ul className="space-y-4">
							{LeftBullets.map((b, i) => (
								<li key={i} className="flex items-start gap-3 text-white/85">
									<FiCheckCircle className="mt-0.5 h-5 w-5 text-emerald-400 flex-shrink-0" />
									<span className="leading-relaxed">{b}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h3 className="text-white text-xl font-semibold mb-4">
							Compliance & privacy
						</h3>
						<ul className="space-y-4">
							{RightBullets.map((b, i) => (
								<li key={i} className="flex items-start gap-3 text-white/85">
									<FiShield className="mt-0.5 h-5 w-5 text-blue-400 flex-shrink-0" />
									<span className="leading-relaxed">{b}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HRLeadersSection


