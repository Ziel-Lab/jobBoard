import { NextResponse } from 'next/server'
import { getOauthUrl } from '@/lib/api'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const provider = (searchParams.get('provider') || '') as 'google' | 'linkedin'
		const redirect_to = searchParams.get('redirect_to') || ''
		const data = await getOauthUrl({ provider, redirect_to })
		return NextResponse.json(data)
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


