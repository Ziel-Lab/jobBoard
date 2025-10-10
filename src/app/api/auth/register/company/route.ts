import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const backendRes = await fetch(`${API_BASE_URL}/auth/register/company`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})
		if (!backendRes.ok) {
			const err = await backendRes.json().catch(() => ({}))
			return NextResponse.json({ error: err.message || 'Registration failed' }, { status: backendRes.status })
		}
		const data = await backendRes.json()
		return NextResponse.json(data)
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


