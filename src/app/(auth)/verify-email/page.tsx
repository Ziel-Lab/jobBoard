'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { authVerifyEmail } from '@/lib/api'

function VerifyEmailContent() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [email, setEmail] = useState(searchParams.get('email') || '')
	const [accessToken, setAccessToken] = useState('')
	const [refreshToken, setRefreshToken] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)
	const [hasVerified, setHasVerified] = useState(false)

	const handleAutoVerify = useCallback(async (access_token: string, refresh_token: string) => {
		if (isSubmitting || hasVerified) return
		setHasVerified(true)
		setIsSubmitting(true)
		setError(null)
		try {
			const res = await authVerifyEmail({ access_token, refresh_token, type: 'signup' })
			// Store session tokens - user is now logged in
			if (res?.accessToken) {
				localStorage.setItem('accessToken', res.accessToken)
				if (res.refreshToken) {
					localStorage.setItem('refreshToken', res.refreshToken)
				}
			}
			setSuccess(true)
			// Redirect to employer dashboard since user is now authenticated
			setTimeout(() => router.push('/employer'), 2000)
		} catch (e) {
			setError((e as Error).message)
			setHasVerified(false)
		} finally {
			setIsSubmitting(false)
		}
	}, [isSubmitting, hasVerified, router])

	// Extract tokens from Supabase redirect URL hash
	useEffect(() => {
		if (typeof window !== 'undefined' && !hasVerified) {
			const hash = window.location.hash
			const urlParams = new URLSearchParams(hash.substring(1))
			const access_token = urlParams.get('access_token')
			const refresh_token = urlParams.get('refresh_token')
			const type = urlParams.get('type')
			
			if (access_token && refresh_token && type === 'signup') {
				setAccessToken(access_token)
				setRefreshToken(refresh_token)
				
				// Extract email from JWT token for display purposes
				if (!email) {
					try {
						const payload = JSON.parse(atob(access_token.split('.')[1]))
						if (payload.email) {
							setEmail(payload.email)
						}
					} catch (e) {
						console.error('Failed to parse JWT token:', e)
					}
				}
				
				// Auto-submit verification with both tokens
				handleAutoVerify(access_token, refresh_token)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<main className="min-h-screen bg-black relative overflow-hidden">
			{/* Ambient light effects */}
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
			
			<div className="container mx-auto px-4 py-16 relative z-10">
				<div className="mx-auto max-w-md rounded-xl border border-white/30 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset] relative overflow-hidden">
					{/* Shine effect overlay */}
					<div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
					<div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
					<div className="relative z-10">
					<h1 className="mb-2 text-2xl font-semibold text-white">Verify your email</h1>
					{success ? (
						<div className="text-center py-8">
							<div className="mb-4">
								<svg className="mx-auto h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<p className="text-lg font-medium text-emerald-400 mb-2">Email verified successfully!</p>
							<p className="text-sm text-white/70">Logging you in...</p>
						</div>
					) : isSubmitting && accessToken ? (
						<div className="text-center py-8">
							<div className="mb-4">
								<div className="mx-auto h-16 w-16 border-4 border-white/50 border-t-transparent rounded-full animate-spin"></div>
							</div>
							<p className="text-lg font-medium mb-2 text-white">Verifying your email</p>
							<p className="text-sm text-white/70">Please wait...</p>
						</div>
					) : error && accessToken ? (
						<>
							<div className="text-center py-4">
								<p className="text-sm text-red-500 mb-4">{error}</p>
								<button
									onClick={() => {
										setError(null)
										setHasVerified(false)
										if (accessToken && refreshToken) {
											handleAutoVerify(accessToken, refreshToken)
										}
									}}
									className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-md hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
								>
									Try again
								</button>
							</div>
						</>
					) : (
						<>
							<p className="mb-4 text-sm text-white/80">
								Click the verification link in your email to continue.
							</p>
							{error && <p className="text-sm text-red-500 mb-4">{error}</p>}
						</>
					)}
					</div>
				</div>
			</div>
		</main>
	)
}

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={
			<main className="min-h-screen bg-black relative overflow-hidden">
				{/* Ambient light effects */}
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
				
				<div className="container mx-auto px-4 py-16 relative z-10">
					<div className="mx-auto max-w-md rounded-xl border border-white/30 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset] relative overflow-hidden">
						{/* Shine effect overlay */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
						<div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
						<div className="relative z-10">
						<h1 className="mb-2 text-2xl font-semibold text-white">Verify your email</h1>
						<div className="text-center py-8">
							<div className="mb-4">
								<div className="mx-auto h-16 w-16 border-4 border-white/50 border-t-transparent rounded-full animate-spin"></div>
							</div>
							<p className="text-lg font-medium mb-2 text-white">Loading...</p>
						</div>
						</div>
					</div>
				</div>
			</main>
		}>
			<VerifyEmailContent />
		</Suspense>
	)
}



