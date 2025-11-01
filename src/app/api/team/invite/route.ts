import { NextRequest, NextResponse } from 'next/server'
import { getForwardedCookies, hasAuthCookies } from '@/lib/api-auth-helpers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function POST(req: NextRequest) {
	try {
		// Check if auth cookies are present
		if (!await hasAuthCookies()) {
			return NextResponse.json(
				{ error: 'Unauthorized - Please log in again' },
				{ status: 401 }
			)
		}
		
		const body = await req.json()
		
		// Forward cookies to backend
		const backendRes = await fetch(`${API_BASE_URL}/team/invite`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': await getForwardedCookies(), // ✅ Forward HttpOnly cookies to backend
			},
			body: JSON.stringify(body),
		})
		
		if (!backendRes.ok) {
			const err = await backendRes.json().catch(() => ({}))
			return NextResponse.json({ error: err.message || 'Invite failed' }, { status: backendRes.status })
		}
		
		return NextResponse.json({ ok: true })
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


