'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
// import { logout } from '@/lib/auth-utils'
import { LogOut, Home, Briefcase, Users, Settings } from 'lucide-react'
import { getCurrentSubdomain, buildSubdomainUrl } from '@/lib/subdomain-utils'

export default function EmployerNavbar() {
	const router = useRouter()
	const [careersUrl, setCareersUrl] = useState('/careers')
	const [dashboardUrl, setDashboardUrl] = useState('/employer')

	useEffect(() => {
		// Get subdomain from current URL and build URLs
		const subdomain = getCurrentSubdomain()
		if (subdomain) {
			const careersUrlBuilt = buildSubdomainUrl('/careers', subdomain)
			setCareersUrl(careersUrlBuilt)
			
			// For employer routes, we can use relative paths since middleware handles subdomain routing
			// But for consistency and to ensure it works, we'll build the full URL too
			const dashboardUrlBuilt = buildSubdomainUrl('/employer', subdomain)
			setDashboardUrl(dashboardUrlBuilt)
		}
	}, [])

	const [isLoggingOut, setIsLoggingOut] = useState(false)

	async function handleLogout() {
		if (isLoggingOut) return
		setIsLoggingOut(true)

		try {
			// Get current access token for the logout request
			const accessToken = document.cookie
				.split('; ')
				.find(row => row.startsWith('accessToken='))
				?.split('=')[1]

			// Call backend logout endpoint through our proxy
			const res = await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include', // Important: needed for cookies
				headers: {
					'Content-Type': 'application/json',
					...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
				},
			})

			if (!res.ok) {
				throw new Error(await res.text())
			}

			// Redirect to login and force a page refresh to clear state
			router.replace('/login')
			window.location.reload()
		} catch (err) {
			console.error('Logout error:', err)
			// Still redirect on error
			router.replace('/login')
		} finally {
			setIsLoggingOut(false)
		}
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
						{dashboardUrl.startsWith('http') ? (
							<a href={dashboardUrl} className="flex items-center gap-2 font-semibold">
								<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 shadow-inner">
									<Briefcase className="w-4 h-4 text-indigo-400" />
								</span>
								<span className="text-sm sm:text-base text-white/90">Employer Portal</span>
							</a>
						) : (
							<Link href={dashboardUrl} className="flex items-center gap-2 font-semibold">
								<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 shadow-inner">
									<Briefcase className="w-4 h-4 text-indigo-400" />
								</span>
								<span className="text-sm sm:text-base text-white/90">Employer Portal</span>
							</Link>
						)}

						{/* Navigation Links */}
						<div className="hidden md:flex items-center gap-6">
							{dashboardUrl.startsWith('http') ? (
								<a 
									href={dashboardUrl}
									className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
								>
									<Home className="w-4 h-4" />
									Dashboard
								</a>
							) : (
								<Link 
									href={dashboardUrl}
									className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
								>
									<Home className="w-4 h-4" />
									Dashboard
								</Link>
							)}
							<Link 
								href="/employer/jobs" 
								className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
							>
								<Briefcase className="w-4 h-4" />
								Jobs
							</Link>
							{careersUrl.startsWith('http') ? (
								<a 
									href={careersUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
								>
									<Users className="w-4 h-4" />
									Careers
								</a>
							) : (
								<Link 
									href={careersUrl}
									className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
								>
									<Users className="w-4 h-4" />
									Careers
								</Link>
							)}
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
							disabled={isLoggingOut}
							className={`flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ${isLoggingOut ? 'opacity-60 cursor-wait' : ''}`}
						>
							{isLoggingOut ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400" />
									<span className="hidden sm:inline">Logging out...</span>
								</>
							) : (
								<>
									<LogOut className="w-4 h-4" />
									<span className="hidden sm:inline">Logout</span>
								</>
							)}
						</button>
					</div>

					{/* Mobile Navigation */}
					<div className="flex md:hidden items-center gap-4 mt-3 pt-3 border-t border-white/10">
						{dashboardUrl.startsWith('http') ? (
							<a 
								href={dashboardUrl}
								className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
							>
								<Home className="w-4 h-4" />
								Dashboard
							</a>
						) : (
							<Link 
								href={dashboardUrl}
								className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
							>
								<Home className="w-4 h-4" />
								Dashboard
							</Link>
						)}
						<Link 
							href="/employer/jobs" 
							className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
						>
							<Briefcase className="w-4 h-4" />
							Jobs
						</Link>
						{careersUrl.startsWith('http') ? (
							<a 
								href={careersUrl}
								className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
							>
								<Users className="w-4 h-4" />
								Careers
							</a>
						) : (
							<Link 
								href={careersUrl}
								className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
							>
								<Users className="w-4 h-4" />
								Careers
							</Link>
						)}
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