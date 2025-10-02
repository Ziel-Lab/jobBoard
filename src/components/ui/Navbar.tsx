'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="pointer-events-auto mx-4 w-full max-w-7xl relative">
      <nav
        className="mt-4 w-full rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-white/5 text-white"
        aria-label="Main"
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 shadow-inner"></span>
            <span className="text-sm sm:text-base text-white/90">Hulo</span>
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">Home</Link>
            <Link href="/jobs" className="text-sm text-white/70 hover:text-white transition-colors">Jobs</Link>
            <Link
              href="/register"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}


