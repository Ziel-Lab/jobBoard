'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlareHover from '@/components/ui/GlareHover'
import { FiEye, FiEyeOff, FiChevronDown } from 'react-icons/fi'
import { FaLinkedin } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import TextType from '@/components/ui/TextType'

export default function RegisterPage() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
            <form className="space-y-5" aria-label="Registration form">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="John Doe"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  I am a
                </label>
                <div
                  className="relative"
                  tabIndex={0}
                  onBlur={(e) => {
                    // close when focus leaves container
                    const currentTarget = e.currentTarget
                    requestAnimationFrame(() => {
                      if (!currentTarget.contains(document.activeElement)) {
                        const pop = currentTarget.querySelector('[data-role-popover]') as HTMLDivElement | null
                        if (pop) pop.style.display = 'none'
                      }
                    })
                  }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-left text-sm outline-none ring-primary/20 transition focus:ring-2"
                    onClick={(e) => {
                      const pop = (e.currentTarget.nextElementSibling as HTMLDivElement | null)
                      if (!pop) return
                      pop.style.display = pop.style.display === 'block' ? 'none' : 'block'
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={false}
                  >
                    <span className="capitalize">{role}</span>
                    <FiChevronDown className="text-muted-foreground" />
                  </button>
                  <div
                    data-role-popover
                    className="absolute left-0 top-full z-50 mt-1 hidden w-full min-w-full overflow-hidden rounded-md border bg-card text-foreground shadow-lg"
                    role="listbox"
                  >
                    {['candidate','employer'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        role="option"
                        aria-selected={role === opt}
                        className={`w-full bg-gray-800 cursor-pointer px-3 py-2 text-left text-sm transition hover:bg-muted/70 ${role === opt ? 'bg-muted' : ''}`}
                        onClick={(e) => {
                          setRole(opt as 'candidate' | 'employer')
                          const pop = (e.currentTarget.parentElement as HTMLDivElement | null)
                          if (pop) pop.style.display = 'none'
                        }}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {role === 'employer' && (
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium text-foreground">
                    Company name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    placeholder="Acme Inc."
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-2"
                  />
                </div>
              )}

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

              <GlareHover
                width="100%"
                height="44px"
                background="hsl(var(--primary))"
                borderRadius="8px"
                borderColor="hsl(var(--primary))"
                className="w-full"
              >
                <button
                  type="button"
                  disabled
                  aria-disabled
                  className="w-full h-full text-sm font-medium text-primary-foreground cursor-pointer"
                >
                  Create account
                </button>
              </GlareHover>

              <div className="relative py-2 text-center text-xs text-muted-foreground">
                <span className="bg-card px-2">or continue with</span>
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted cursor-pointer">
                  <FcGoogle className="text-base" />
                  Google
                </button>
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted cursor-pointer">
                  <FaLinkedin className="text-[#0A66C2]" />
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
