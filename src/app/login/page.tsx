'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import GlareHover from '@/components/ui/GlareHover'
import { authLogin } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { setAccessToken } from '@/lib/auth-utils'

interface LoginResponse {
  session?: {
    access_token: string
    expires_at: number
    user_id: string
  }
  accessToken?: string
  expiresAt?: number
  userId?: string
  needsCompanySetup?: boolean
  profile?: {
    id: string
    email: string
    role: string
    company_id?: string
    onboarding_completed?: boolean
  } | null
  redirectUrl?: string
  subdomain?: string
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isSubmitting) return
    setError(null)
    setIsSubmitting(true)
    
    try {
      const form = new FormData(e.currentTarget)
      const email = String(form.get('email') || '')
      const password = String(form.get('password') || '')

      const res = await authLogin({ email, password }) as LoginResponse
      
      // Extract auth data from response
      const accessToken = res?.session?.access_token || res?.accessToken
      const expiresAt = res?.session?.expires_at || res?.expiresAt
      const userId = res?.session?.user_id || res?.userId
      const subdomain = res?.subdomain
      
      if (!accessToken) {
        throw new Error('No access token received')
      }

      // Do NOT store access tokens in localStorage. Server sets an HttpOnly cookie.
      // Persist only non-sensitive client metadata (expires_at, user_id, subdomain).
      setAccessToken(undefined, expiresAt, userId, subdomain)
      
      // Add small delay to ensure cookie is set by the browser
      // The login API route sets an HttpOnly cookie that the middleware checks
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Handle redirect based on response
      // Check multiple conditions to determine if onboarding is needed
      const needsSetup = 
        res?.needsCompanySetup === true || 
        !res?.profile || 
        res?.profile?.onboarding_completed === false ||
        !res?.profile?.company_id
      
      if (needsSetup) {
        // User has NOT completed company setup → redirect to onboarding
        console.log('User needs company setup, redirecting to onboarding')
        const targetUrl = res?.redirectUrl === '/onboarding/company' 
          ? '/company/onboarding' 
          : res?.redirectUrl || '/company/onboarding'
        router.push(targetUrl)
      } else {
        // User HAS completed company setup → redirect to company subdomain
        console.log('User has completed setup, redirecting to dashboard')
        
        // Check if backend provided a redirectUrl (with subdomain)
        if (res?.redirectUrl && res.redirectUrl.startsWith('http')) {
          // Full URL redirect (includes subdomain) - use window.location for cross-domain redirect
          console.log('Redirecting to subdomain:', res.redirectUrl)
          window.location.href = res.redirectUrl
        } else {
          // Fallback to local redirect (same domain)
          const targetUrl = redirectUrl || res?.redirectUrl || '/employer'
          router.push(targetUrl)
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError((err as Error).message || 'Failed to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Ambient light effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Employer sign in
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your employer dashboard
            </p>
          </div>

          <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset] relative overflow-hidden">
            {/* Shine effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
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
                    className="w-full rounded-md border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-white/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-white/50 focus:bg-white/20 focus:border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
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
                      className="w-full rounded-md border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-2 pr-10 text-sm text-white placeholder-white/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-white/50 focus:bg-white/20 focus:border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
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
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
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
                
                <p className="font-thin mt-6 text-center text-sm text-white/80">
                  Don&apos;t have an employer account?
                  {' '}
                  <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline cursor-pointer">
                    Create one
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}