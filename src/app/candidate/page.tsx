import ProfileHeader from '@/components/profiles/ProfileHeader'
import type { CandidateProfile } from '@/types/profile'

async function fetchCandidate ()
{
  const url = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/profiles/candidate`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to load profile')
  return res.json() as Promise<CandidateProfile>
}

export default async function CandidatePage ()
{
  const profile = await fetchCandidate()

  return (
    <main className="relative z-0 mx-auto w-full max-w-7xl px-4 pt-10 pb-16 text-white">
      <ProfileHeader
        title={profile.fullName}
        subtitle={profile.headline}
        location={profile.location}
        actions={[{ label: 'Download Resume', href: profile.resumeUrl || '#' }, { label: 'Contact', href: `mailto:${profile.email}` }]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 space-y-5">
          {/* Summary */}
          {profile.summary && (
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-emerald-200">About</h2>
              <p className="mt-2 text-white/80 text-sm leading-6">{profile.summary}</p>
            </article>
          )}

          {/* Experience */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-indigo-200">Experience</h2>
            <div className="mt-3 space-y-4">
              {profile.experience.map(exp => (
                <div key={exp.id} className="rounded-xl border border-white/10 bg-gradient-to-br from-black/30 to-indigo-500/5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">{exp.role}</p>
                      <p className="text-xs text-white/70">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-[11px] text-sky-200/80">
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                  </div>
                  {exp.summary && <p className="mt-2 text-sm text-white/80">{exp.summary}</p>}
                  {!!exp.achievements?.length && (
                    <ul className="mt-2 list-disc pl-5 text-sm text-white/80 space-y-1">
                      {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  )}
                  {!!exp.skills?.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exp.skills.map(s => <span key={s} className="rounded-full border border-indigo-300/25 bg-indigo-500/10 px-2.5 py-1 text-[11px] text-indigo-200">{s}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* Projects */}
          {!!profile.projects?.length && (
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-sky-200">Projects</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.projects.map(p => (
                  <div key={p.id} className="rounded-xl border border-white/10 bg-gradient-to-br from-black/30 to-emerald-500/5 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      {p.link && <a href={p.link} className="text-xs text-emerald-200 underline">View</a>}
                    </div>
                    <p className="mt-1 text-sm text-white/80">{p.description}</p>
                    {!!p.skills?.length && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.skills.map(s => <span key={s} className="rounded-full border border-emerald-300/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200">{s}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>
          )}
        </section>

        <aside className="space-y-5">
          {/* Skills */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-fuchsia-200">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map(s => <span key={s} className="rounded-full border border-fuchsia-300/25 bg-fuchsia-500/10 px-2.5 py-1 text-[11px] text-fuchsia-200">{s}</span>)}
            </div>
          </section>

          {/* Education */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-amber-200">Education</h2>
            <div className="mt-3 space-y-3">
              {profile.education.map(ed => (
                <div key={ed.id} className="rounded-xl border border-white/10 bg-gradient-to-br from-black/30 to-amber-500/5 p-3">
                  <p className="text-sm font-medium text-white">{ed.school}</p>
                  <p className="text-xs text-white/80">{ed.degree} • {ed.field}</p>
                  <p className="text-[11px] text-amber-200/80 mt-1">{new Date(ed.startDate).toLocaleDateString()} - {ed.endDate ? new Date(ed.endDate).toLocaleDateString() : 'Present'}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          {!!profile.certifications?.length && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-cyan-200">Certifications</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                {profile.certifications.map(c => (
                  <li key={c.id} className="flex items-center justify-between">
                    <span className="text-white">{c.name} • <span className="text-cyan-200/90">{c.issuer}</span></span>
                    <span className="text-[11px] text-cyan-200/80">{new Date(c.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Preferences */}
          {profile.preferences && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-emerald-200">Job Preferences</h2>
              <div className="mt-3 space-y-2 text-sm text-white/80">
                {profile.preferences.remote !== undefined && <p>Remote: {profile.preferences.remote ? 'Yes' : 'No'}</p>}
                {!!profile.preferences.locations?.length && <p>Locations: <span className="text-emerald-200">{profile.preferences.locations.join(', ')}</span></p>}
                {!!profile.preferences.employmentTypes?.length && <p>Types: <span className="text-emerald-200">{profile.preferences.employmentTypes.join(', ')}</span></p>}
                {(profile.preferences.expectedSalaryMin || profile.preferences.expectedSalaryMax) && (
                  <p>Expected: <span className="text-emerald-200">{profile.preferences.currency} {profile.preferences.expectedSalaryMin?.toLocaleString()} - {profile.preferences.expectedSalaryMax?.toLocaleString()}</span></p>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  )
}


