'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

function useUpdateSearchParams ()
{
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  return (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') params.delete(key)
      else params.set(key, value)
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }
}

export default function JobFilters ()
{
  const searchParams = useSearchParams()
  const update = useUpdateSearchParams()

  const q = searchParams.get('q') || ''
  const location = searchParams.get('location') || ''
  const type = searchParams.get('type') || ''
  const remote = searchParams.get('remote') || ''
  const experience = searchParams.get('experience') || ''
  const postedWithin = searchParams.get('postedWithin') || ''
  const sort = searchParams.get('sort') || 'recent'

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-white/90 backdrop-blur-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          defaultValue={q}
          onKeyDown={e => {
            if (e.key === 'Enter') update({ q: (e.target as HTMLInputElement).value })
          }}
          placeholder="Search jobs, companies, skills"
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
        />

        <input
          defaultValue={location}
          onKeyDown={e => { if (e.key === 'Enter') update({ location: (e.target as HTMLInputElement).value }) }}
          placeholder="Location"
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
        />

        <select
          value={type}
          onChange={e => update({ type: e.target.value || null })}
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">Any type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>

        <select
          value={remote}
          onChange={e => update({ remote: e.target.value || null })}
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">On-site/Hybrid/Remote</option>
          <option value="true">Remote</option>
          <option value="false">On-site</option>
        </select>

        <select
          value={experience}
          onChange={e => update({ experience: e.target.value || null })}
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">Any experience</option>
          <option value="entry">Entry</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </select>

        <select
          value={postedWithin}
          onChange={e => update({ postedWithin: e.target.value || null })}
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">Any time</option>
          <option value="24h">Past 24 hours</option>
          <option value="3d">Past 3 days</option>
          <option value="7d">Past 7 days</option>
          <option value="14d">Past 14 days</option>
          <option value="30d">Past 30 days</option>
        </select>

        <select
          value={sort}
          onChange={e => update({ sort: e.target.value })}
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="recent">Most recent</option>
          <option value="salary-desc">Salary: High to Low</option>
          <option value="salary-asc">Salary: Low to High</option>
        </select>

        <button
          onClick={() => update({ q: null, location: null, type: null, remote: null, experience: null, postedWithin: null, sort: 'recent' })}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/15"
        >
          Clear filters
        </button>
      </div>
    </section>
  )
}



