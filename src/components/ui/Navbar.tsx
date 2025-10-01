'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="pointer-events-auto mx-4 w-full max-w-7xl">
      <nav
        className="mt-4 w-full rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-white/5 text-white"
        aria-label="Main"
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 shadow-inner"></span>
            <span className="text-sm sm:text-base text-white/90">Hulo</span>
          </Link>

          <button
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 sm:hidden"
            onClick={() => setOpen(v => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current">
              {open ? (
                <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>

          <div className="hidden items-center gap-6 sm:flex">
            <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">Home</Link>
            <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">Docs</Link>
            <Link
              href="#"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              Get Started
            </Link>
          </div>
        </div>

        {open && (
          <div className="sm:hidden border-t border-white/10 px-4 py-3 bg-white/5 rounded-b-full">
            <div className="flex flex-col gap-2">
              <Link href="#" className="rounded-md px-2 py-2 text-white/90 hover:bg-white/10">Home</Link>
              <Link href="#" className="rounded-md px-2 py-2 text-white/90 hover:bg-white/10">Docs</Link>
              <Link href="#" className="rounded-md px-2 py-2 text-white/90 hover:bg-white/10">Get Started</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}


