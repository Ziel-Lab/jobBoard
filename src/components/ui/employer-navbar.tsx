'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import { logout } from '@/lib/auth-utils'
import { LogOut, Home, Briefcase, Users, Settings } from 'lucide-react'

export default function EmployerNavbar() {
	const router = useRouter()

	function handleLogout() {
		// logout()
		router.push('/login')
	}

	return (
		<header className="pointer-events-auto w-full relative">
			<nav
				className="w-full border-b border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white"
				aria-label="Employer Navigation"
			>
				<div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
					<div className="flex items-center justify-between">
						{/* Logo/Brand */}
						<Link href="/employer" className="flex items-center gap-2 font-semibold">
							<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 shadow-inner">
								<Briefcase className="w-4 h-4 text-indigo-400" />
							</span>
							<span className="text-sm sm:text-base text-white/90">Employer Portal</span>
						</Link>

						{/* Navigation Links */}
						<div className="hidden md:flex items-center gap-6">
							<Link 
								href="/employer" 
								className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
							>
								<Home className="w-4 h-4" />
								Dashboard
							</Link>
							<Link 
								href="/employer/jobs" 
								className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
							>
								<Briefcase className="w-4 h-4" />
								Jobs
							</Link>
							<Link 
								href="/employer/candidates" 
								className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
							>
								<Users className="w-4 h-4" />
								Candidates
							</Link>
							<Link 
								href="/employer/settings" 
								className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
							>
								<Settings className="w-4 h-4" />
								Settings
							</Link>
						</div>

						{/* Logout Button */}
						<button
							onClick={handleLogout}
							className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
						>
							<LogOut className="w-4 h-4" />
							<span className="hidden sm:inline">Logout</span>
						</button>
					</div>

					{/* Mobile Navigation */}
					<div className="flex md:hidden items-center gap-4 mt-3 pt-3 border-t border-white/10">
						<Link 
							href="/employer" 
							className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
						>
							<Home className="w-4 h-4" />
							Dashboard
						</Link>
						<Link 
							href="/employer/jobs" 
							className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
						>
							<Briefcase className="w-4 h-4" />
							Jobs
						</Link>
						<Link 
							href="/employer/candidates" 
							className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
						>
							<Users className="w-4 h-4" />
							Candidates
						</Link>
						<Link 
							href="/employer/settings" 
							className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
						>
							<Settings className="w-4 h-4" />
							Settings
						</Link>
					</div>
				</div>
			</nav>
		</header>
	)
}