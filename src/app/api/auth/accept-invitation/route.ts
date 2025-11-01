import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

/**
 * Get cookie domain for subdomain support
 * Returns .localhost for development or .yourdomain.com for production
 */
function getCookieDomain(req: Request): string | undefined {
    const hostname = new URL(req.url).hostname

    // For localhost:
    // - If on plain 'localhost', do NOT set a domain (host-only cookie)
    // - If on '*.localhost' (e.g., company.localhost), set domain to '.localhost'
    if (hostname === 'localhost') {
        return undefined
    }
    if (hostname.endsWith('.localhost')) {
        return '.localhost'
    }

    // For IP addresses like 127.0.0.1, don't set domain
    if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        return undefined
    }

    // For production domains - extract root domain
    const parts = hostname.split('.')
    if (parts.length >= 2) {
        // Return the last two parts with a leading dot
        const domain = `.${parts.slice(-2).join('.')}`
        return domain
    }

    return undefined
}

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
		
		// Extract tokens from session object or direct fields
		const accessToken = data?.session?.access_token || data?.accessToken
		const refreshToken = data?.session?.refresh_token || data?.refreshToken
		
		// Set cookies as HttpOnly for secure server-side access
		const cookieDomain = getCookieDomain(req)
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax' as const,
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/',
			domain: cookieDomain,
		}
		
		if (accessToken) {
			console.log('[Accept Invitation API] Setting accessToken cookie')
			response.cookies.set('accessToken', accessToken, cookieOptions)
		}
		
		if (refreshToken) {
			console.log('[Accept Invitation API] Setting refreshToken cookie')
			response.cookies.set('refreshToken', refreshToken, cookieOptions)
		}
		
		return response
	} catch (e) {
		return NextResponse.json({ error: (e as Error).message }, { status: 400 })
	}
}


