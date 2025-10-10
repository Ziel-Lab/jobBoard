import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const backendRes = await fetch(`${API_BASE_URL}/auth/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})
		if (!backendRes.ok) {
			const err = await backendRes.json().catch(() => ({}))
			return NextResponse.json({ error: err.message || 'Signup failed' }, { status: backendRes.status })
		}
		return NextResponse.json({ ok: true })
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


