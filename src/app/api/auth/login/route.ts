import { NextResponse } from 'next/server'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

/**
 * Get cookie domain for subdomain support
 * Returns .localhost for development or .yourdomain.com for production
 */
function getCookieDomain(req: Request): string | undefined {
	const hostname = new URL(req.url).hostname
	
	// For localhost (including subdomains)
	if (hostname.includes('localhost')) {
		return '.localhost'
	}
	
	// For production domains - extract root domain
	const parts = hostname.split('.')
	if (parts.length >= 2) {
		// Return the last two parts with a leading dot
		return `.${parts.slice(-2).join('.')}`
	}
	
	return undefined
}

export async function POST(req: Request) {
	try {
		const body = await req.json()
		// Forward login to backend directly to avoid client-only imports
		const backendRes = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})

		if (!backendRes.ok) {
			const err = await backendRes.json().catch(() => ({}))
			return NextResponse.json({ error: err.message || 'Login failed' }, { status: backendRes.status })
		}

		const data = await backendRes.json()
		
		// Create response with the login data
		const response = NextResponse.json(data)
		
		// Extract access token from session object or direct accessToken field
		const accessToken = data.session?.access_token || data.accessToken
		
		// Set the accessToken as an HttpOnly cookie for secure server-side access
		// Cookie domain is set to work across subdomains (.localhost or .yourdomain.com)
		if (accessToken) {
			const cookieOptions = {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax' as const,
				maxAge: 60 * 60 * 24 * 7, // 7 days
				path: '/',
				domain: getCookieDomain(req),
			}
			
			response.cookies.set('accessToken', accessToken, cookieOptions)
		}
		
		return response
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


