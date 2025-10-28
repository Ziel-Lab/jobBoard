'use client'

import { useState } from 'react'
import { authForgotPassword } from '@/lib/api'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!email) return
		setIsSubmitting(true)
		setError(null)
		try {
			await authForgotPassword({ email })
			setSuccess(true)
		} catch (e) {
			setError((e as Error).message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen flex items-center justify-center bg-black">
			<div className="w-full max-w-md p-6 bg-white/10 backdrop-blur rounded-xl border border-white/20">
				<h1 className="text-2xl font-semibold text-white mb-4">Forgot Password</h1>
				{success ? (
					<p className="text-white">Check your email for a password reset link.</p>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email address"
							className="w-full p-2 rounded bg-white/5 text-white border border-white/20 focus:outline-none"
							required
						/>
						{error && <p className="text-red-500 text-sm">{error}</p>}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full py-2 bg-emerald-500 disabled:opacity-50 rounded text-white"
						>
							{isSubmitting ? 'Sending...' : 'Send reset link'}
						</button>
					</form>
				)}
			</div>
		</main>
	)
}
