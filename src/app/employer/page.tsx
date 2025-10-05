import ProfileHeader from '@/components/profiles/ProfileHeader'
import type { EmployerProfile } from '@/types/profile'

export const dynamic = 'force-dynamic'

async function fetchEmployer ()
{
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
	const url = `${baseUrl}/api/profiles/employer`
	const res = await fetch(url, { next: { revalidate: 60 } })
	if (!res.ok) throw new Error('Failed to load employer')
	return res.json() as Promise<EmployerProfile>
}

export default async function EmployerPage ()
{
	const profile = await fetchEmployer()

	return (
		<main className="relative z-0 mx-auto w-full max-w-7xl px-4 pt-10 pb-16 text-white">
			<ProfileHeader
				title={profile.companyName}
				subtitle={profile.industry || ''}
				location={profile.location}
				actions={[{ label: 'Visit Website', href: profile.website || '#' }]}
			/>

			<div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
				<section className="lg:col-span-2 space-y-5">
					{profile.description && (
						<article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
							<h2 className="text-lg font-semibold text-indigo-200">About</h2>
							<p className="mt-2 text-white/80 text-sm leading-6">{profile.description}</p>
						</article>
					)}
				</section>

				<aside className="space-y-5">
					<section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
						<h2 className="text-lg font-semibold text-emerald-200">Company Info</h2>
						<div className="mt-3 space-y-2 text-sm text-white/80">
							{profile.size && <p>Size: <span className="text-emerald-200">{profile.size}</span></p>}
							{profile.industry && <p>Industry: <span className="text-emerald-200">{profile.industry}</span></p>}
							{profile.website && <a className="text-sky-200 underline" href={profile.website}>{profile.website}</a>}
						</div>
					</section>
				</aside>
			</div>
		</main>
	)
}

