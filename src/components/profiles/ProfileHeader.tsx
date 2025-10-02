'use client'

import Link from 'next/link'

interface ProfileHeaderProps
{
  title: string
  subtitle?: string
  location?: string
  actions?: Array<{ label: string, href: string }>
}

export default function ProfileHeader ({ title, subtitle, location, actions }: ProfileHeaderProps)
{
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-white/80 mt-1">{subtitle}</p>}
          {location && (
            <span className="inline-flex mt-2 items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-[11px] text-indigo-200">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="stroke-current opacity-80">
                <path d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11z" strokeWidth="1.5"/>
                <circle cx="12" cy="10" r="2.5" strokeWidth="1.5"/>
              </svg>
              {location}
            </span>
          )}
        </div>
        {!!actions?.length && (
          <div className="flex flex-wrap gap-2">
            {actions.map(a => (
              <Link
                key={a.label}
                href={a.href}
                className="rounded-full border border-emerald-300/30 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:from-emerald-500/20 hover:to-indigo-500/20"
              >
                {a.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"/>
    </section>
  )
}


