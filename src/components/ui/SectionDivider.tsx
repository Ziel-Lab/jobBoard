import React from 'react'

interface SectionDividerProps {
	className?: string
}

const SectionDivider: React.FC<SectionDividerProps> = ({ className = '' }) => {
	return (
		<div
			className={`w-full py-6 ${className}`}
			aria-hidden
		>
			{/* <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent" /> */}
			<div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/25 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
		</div>
	)
}

export default SectionDivider


