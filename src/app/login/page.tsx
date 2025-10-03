'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlareHover from '@/components/ui/GlareHover'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { authLogin, getOauthUrl } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (isSubmitting) return
		setError(null)
		setIsSubmitting(true)
		const form = new FormData(e.currentTarget)
		const email = String(form.get('email') || '')
		const password = String(form.get('password') || '')
		try {
			const res = await authLogin({ email, password })
			if (res?.accessToken) {
				localStorage.setItem('accessToken', res.accessToken)
			}
			router.push('/employer')
		} catch (err) {
			setError((err as Error).message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen">
			<div className="container mx-auto px-4 py-16">
				<div className="mx-auto max-w-md">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-semibold tracking-tight text-foreground">
							Employer sign in
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Access your employer dashboard
						</p>
					</div>

					<div className="rounded-xl border bg-card p-6 shadow-sm">
						<form className="space-y-5" aria-label="Login form" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<label htmlFor="email" className="text-sm font-medium text-foreground">
									Email address
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									placeholder="you@company.com"
									className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-2"
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="password" className="text-sm font-medium text-foreground">
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										name="password"
										type={showPassword ? 'text' : 'password'}
										required
										placeholder="••••••••"
										className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none ring-primary/20 transition focus:ring-2"
									/>
									<button
										type="button"
										aria-label={showPassword ? 'Hide password' : 'Show password'}
										className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
										onClick={() => setShowPassword(v => !v)}
									>
										{showPassword ? '🙈' : '👁️'}
									</button>
								</div>
							</div>

							{error && (
								<p className="text-sm text-red-500">{error}</p>
							)}

							<GlareHover
								width="100%"
								height="44px"
								background="hsl(var(--primary))"
								borderRadius="8px"
								borderColor="hsl(var(--primary))"
								className="w-full"
							>
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full h-full text-sm font-medium text-primary-foreground cursor-pointer disabled:opacity-60"
								>
									{isSubmitting ? 'Signing in…' : 'Sign in'}
								</button>
						</GlareHover>

						<div className="relative py-2 text-center text-xs text-muted-foreground">
							<span className="bg-card px-2">or continue with</span>
							<span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
						</div>

						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={async () => {
									const redirect_to = `${window.location.origin}/login`
									const { url } = await getOauthUrl({ provider: 'google', redirect_to })
									window.location.href = url
								}}
								className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted cursor-pointer"
							>
								Google
							</button>
							<button
								type="button"
								onClick={async () => {
									const redirect_to = `${window.location.origin}/login`
									const { url } = await getOauthUrl({ provider: 'linkedin', redirect_to })
									window.location.href = url
								}}
								className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted cursor-pointer"
							>
								LinkedIn
							</button>
						</div>
						</form>
					</div>

					<p className="mt-6 text-center text-sm text-muted-foreground">
						Don't have an employer account?
						{' '}
						<Link href="/register" className="text-primary underline-offset-4 hover:underline cursor-pointer">
							Create one
						</Link>
					</p>
				</div>
			</div>
		</main>
	)
}

