import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const backendRes = await fetch(`${API_BASE_URL}/auth/accept-invitation`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})
		if (!backendRes.ok) {
			const err = await backendRes.json().catch(() => ({}))
			return NextResponse.json({ error: err.message || 'Invitation failed' }, { status: backendRes.status })
		}
		const data = await backendRes.json()
		
		// Create response with the invitation data
		const response = NextResponse.json(data)
		
		// Extract access token from session object or direct accessToken field
		const accessToken = data?.session?.access_token || data?.accessToken
		
		// Set the accessToken as an HttpOnly cookie for secure server-side access
		if (accessToken) {
			response.cookies.set('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7, // 7 days
				path: '/',
			})
		}
		
		return response
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


