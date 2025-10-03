'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlareHover from '@/components/ui/GlareHover'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import TextType from '@/components/ui/TextType'
import { authSignup, getOauthUrl } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join us to find your next
              <TextType
							text={[" opportunity.", " talent."]}
							className="font-semibold"
							cursorClassName="text-white"
							textColors={["#ffffff"]}
							pauseDuration={1900}
						/>
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <form
              className="space-y-5"
              aria-label="Signup form"
              onSubmit={async (e) => {
                e.preventDefault()
                if (isSubmitting) return
                setError(null)
                setIsSubmitting(true)
                const form = new FormData(e.currentTarget)
                const fullName = String(form.get('fullName') || '')
                const email = String(form.get('email') || '')
                const password = String(form.get('password') || '')
                const confirmPassword = String(form.get('confirmPassword') || '')
                if (password !== confirmPassword) {
                  setError('Passwords do not match')
                  setIsSubmitting(false)
                  return
                }
                try {
                  await authSignup({ name: fullName, email, password })
                  // Redirect to verify-email page with email parameter
                  const verifyUrl = `${window.location.origin}/verify-email?email=${encodeURIComponent(email)}`
                  router.push(verifyUrl)
                } catch (err) {
                  setError((err as Error).message)
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="John"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
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
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none ring-primary/20 transition focus:ring-2"
                  />
                  <button
                    type="button"
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirm(v => !v)}
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* No company fields for basic signup */}

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 rounded border accent-primary"
                  aria-describedby="terms-desc"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the
                  {' '}
                  <Link href="#" className="text-primary underline-offset-4 hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="#" className="text-primary underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
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
                  {isSubmitting ? 'Creating…' : 'Create account'}
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
            Already have an account?
            {' '}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
