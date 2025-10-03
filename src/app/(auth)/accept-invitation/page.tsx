'use client'

import { useState } from 'react'
import GlareHover from '@/components/ui/GlareHover'
import { authAcceptInvitation } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function AcceptInvitationPage() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (isSubmitting) return
		setError(null)
		setIsSubmitting(true)
		const form = new FormData(e.currentTarget)
		const token = String(form.get('token') || '')
    const fullName = String(form.get('fullName') || '')
		const password = String(form.get('password') || '')
		const confirmPassword = String(form.get('confirmPassword') || '')
		if (password !== confirmPassword) {
			setError('Passwords do not match')
			setIsSubmitting(false)
			return
		}
    try {
      await authAcceptInvitation({ token, password, fullName })
			router.push('/login')
		} catch (e) {
			setError((e as Error).message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen">
			<div className="container mx-auto px-4 py-16">
				<div className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm">
					<h1 className="mb-4 text-2xl font-semibold">Accept invitation</h1>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<input name="token" placeholder="Invitation token" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required />
          <input name="fullName" placeholder="Full name" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required />
						<input name="password" type="password" placeholder="Password" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required />
						<input name="confirmPassword" type="password" placeholder="Confirm password" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required />
						{error && <p className="text-sm text-red-500">{error}</p>}
						<GlareHover width="100%" height="44px" background="hsl(var(--primary))" borderRadius="8px" borderColor="hsl(var(--primary))" className="w-full">
							<button type="submit" disabled={isSubmitting} className="w-full h-full text-sm font-medium text-primary-foreground disabled:opacity-60">
								{isSubmitting ? 'Submitting…' : 'Submit'}
							</button>
						</GlareHover>
					</form>
				</div>
			</div>
		</main>
	)
}


