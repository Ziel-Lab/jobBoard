import Navbar from '@/components/ui/Navbar'
import JobFilters from '@/components/jobs/job-filters'
import JobCard from '@/components/jobs/job-card'
import type { PaginatedJobs } from '@/types/job'

export const dynamic = 'force-dynamic'

interface JobsPageProps
{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function fetchJobs (qs: URLSearchParams)
{
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}/api/jobs?${qs.toString()}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to load jobs')
  return res.json() as Promise<PaginatedJobs>
}

export default async function JobsPage ({ searchParams }: JobsPageProps)
{
  const resolvedSearchParams = await searchParams
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(resolvedSearchParams)) {
    if (typeof v === 'string') params.set(k, v)
  }
  params.set('page', params.get('page') || '1')
  params.set('pageSize', params.get('pageSize') || '24')

  const data = await fetchJobs(params)

  return (
    <>
      

      <main className="relative z-0 mx-auto w-full max-w-7xl px-4 pt-28 pb-16 text-white">
        <h1 className="mb-4 text-2xl sm:text-3xl font-semibold text-white">Find your next role</h1>
        <p className="mb-6 text-white/70 text-sm sm:text-base">Browse curated opportunities. Use filters to refine your search.</p>

        <JobFilters />

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {data.items.length === 0 && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
              No jobs match your filters. Try adjusting them.
            </div>
          )}

          {data.items.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>

        <div className="mt-8 flex items-center justify-between text-white/70">
          <span className="text-xs sm:text-sm">Page {data.page} • {data.total} results</span>
          {/* Simple prev/next for now */}
          <div className="flex gap-2">
            <a
              href={`?${(() => { const p = new URLSearchParams(params); p.set('page', String(Math.max(1, Number(p.get('page')||'1')-1))); return p.toString() })()}`}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/20"
            >Prev</a>
            <a
              href={`?${(() => { const p = new URLSearchParams(params); p.set('page', String(Number(p.get('page')||'1')+1)); return p.toString() })()}`}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/20"
            >Next</a>
          </div>
        </div>
      </main>
    </>
  )
}



