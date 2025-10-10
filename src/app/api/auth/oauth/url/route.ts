import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const provider = searchParams.get('provider') || ''
		const redirect_to = searchParams.get('redirect_to') || ''
		const backendRes = await fetch(`${API_BASE_URL}/auth/oauth/url?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirect_to)}`)
		if (!backendRes.ok) {
			const err = await backendRes.json().catch(() => ({}))
			return NextResponse.json({ error: err.message || 'OAuth URL failed' }, { status: backendRes.status })
		}
		const data = await backendRes.json()
		return NextResponse.json(data)
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


