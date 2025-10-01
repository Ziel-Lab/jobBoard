'use client'

import React from 'react'
import TextType from '@/components/ui/TextType'

const Footer: React.FC = () => {
	return (
		<footer className="w-full">
			{/* CTA banner */}
			<section className="w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-black py-12 px-4 sm:px-6">


				<div className="max-w-6xl mx-auto text-center">
					<h3 className="mb-4 text-white font-bold tracking-tight text-2xl sm:text-3xl">
						<TextType
							text={["Hire vetted talent.", "Work less."]}
							className="align-middle"
							cursorClassName="text-white"
							textColors={["#ffffff"]}
							pauseDuration={1800}
						/>
					</h3>
					<p className="text-white/90 max-w-2xl mx-auto">
						Book a demo and see how Hulo delivers interview‑ready shortlists.
					</p>
					<div className="mt-6 flex justify-center">
						<button className="rounded-full px-6 py-3 text-sm font-semibold text-white/90 border border-white/30 bg-white/10 hover:bg-white/15 backdrop-blur-md shadow-[inset_0_2px_0_rgba(255,255,255,0.15),0_0_25px_rgba(255,255,255,0.15),0_0_50px_rgba(255,255,255,0.08),0_1px_3px_rgba(0,0,0,0.3)] transition-all">
							Book a demo →
						</button>
					</div>
				</div>
			</section>

			{/* Links */}
			<section className="w-full py-12 px-4 sm:px-6 bg-[#0b0f17]">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-white/90">
						<div>
							<h4 className="text-white font-semibold mb-3">Hulo</h4>
							<p className="text-white/70 text-sm">Vetted candidates. Zero busywork.</p>
						</div>
						<div>
							<h4 className="text-white font-semibold mb-3">Product</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white">Features</a></li>
								<li><a href="#" className="hover:text-white">How it works</a></li>
								<li><a href="#" className="hover:text-white">Pricing</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-semibold mb-3">Company</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white">About</a></li>
								<li><a href="#" className="hover:text-white">Contact</a></li>
								<li><a href="#" className="hover:text-white">Careers</a></li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-semibold mb-3">Support</h4>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="hover:text-white">Help Center</a></li>
								<li><a href="#" className="hover:text-white">Privacy Policy</a></li>
								<li><a href="#" className="hover:text-white">Terms of Service</a></li>
							</ul>
						</div>
					</div>

					<hr className="my-8 border-white/10" />
					<p className="text-xs text-white/60">© 2025 Hulo. All rights reserved.</p>
				</div>
			</section>
		</footer>
	)
}

export default Footer


