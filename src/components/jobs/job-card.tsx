'use client'

import type { Job } from '@/types/job'
import Link from 'next/link'

interface JobCardProps
{
  job: Job
}

export default function JobCard ({ job }: JobCardProps)
{
  return (
    <article className="group rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-lg transition hover:bg-white/10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
					<h3 className="text-base sm:text-lg font-semibold text-white">{job.jobTitle}</h3>
					<p className="text-xs sm:text-sm text-white/70">{job.company || '—'} • {job.officeLocation} {job.isRemote && <span className="ml-1 rounded-full border border-emerald-400/30 px-2 py-0.5 text-emerald-300/90 text-[10px] align-middle">Remote</span>}</p>
        </div>
        <div className="text-right">
          <p className="text-xs sm:text-sm text-white/70">
						{job.minSalary ? `${job.currency} ${job.minSalary.toLocaleString()} - ${job.maxSalary?.toLocaleString?.() || ''}` : 'Salary: Not disclosed'}
          </p>
					<p className="text-[11px] text-white/50">{new Date(job.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

			<p className="mt-3 line-clamp-2 text-sm text-white/80">{job.jobDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
				{job.requiredSkills.slice(0, 6).map(s => (
          <span key={s} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/80">{s}</span>
        ))}
				{job.requiredSkills.length > 6 && (
					<span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">+{job.requiredSkills.length - 6}</span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-[11px] text-white/60 capitalize">{job.experienceLevel} • {job.employmentType}</span>
				<Link href={`/jobs/${job.id}`} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          Apply
        </Link>
      </div>
    </article>
  )
}



