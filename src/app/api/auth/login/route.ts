import { NextResponse } from 'next/server'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

/**
 * Get cookie domain for subdomain support
 * Returns .localhost for development or .yourdomain.com for production
 */
function getCookieDomain(req: Request): string | undefined {
	const hostname = new URL(req.url).hostname
	
	console.log('[Login API] Setting cookie for hostname:', hostname)
	
	// For localhost:
	// - If on plain 'localhost', do NOT set a domain (host-only cookie)
	// - If on '*.localhost' (e.g., company.localhost), set domain to '.localhost'
	if (hostname === 'localhost') {
		console.log('[Login API] Plain localhost detected, not setting domain')
		return undefined
	}
	if (hostname.endsWith('.localhost')) {
		console.log('[Login API] Subdomain on localhost detected, using domain .localhost')
		return '.localhost'
	}
	
	// For IP addresses like 127.0.0.1, don't set domain
	if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
		console.log('[Login API] IP address detected, not setting domain')
		return undefined
	}
	
	// For production domains - extract root domain
	const parts = hostname.split('.')
	if (parts.length >= 2) {
		// Return the last two parts with a leading dot
		const domain = `.${parts.slice(-2).join('.')}`
		console.log('[Login API] Using cookie domain:', domain)
		return domain
	}
	
	return undefined
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		console.log('[Login API] Login attempt for:', body.email);

		// Forward login to backend directly to avoid client-only imports
		const backendRes = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});

		if (!backendRes.ok) {
			const err = await backendRes.json().catch(() => ({}));
			console.error('[Login API] Backend login failed:', err.message || 'Login failed');
			return NextResponse.json({ error: err.message || 'Login failed' }, { status: backendRes.status });
		}

		const data = await backendRes.json();
		console.log('[Login API] Backend login successful:', data);

		// Create response with the login data
		const response = NextResponse.json(data);

		// Extract access token from session object
		const accessToken = data.session?.access_token;

		// Set the accessToken as an HttpOnly cookie for secure server-side access
		if (accessToken) {
			const cookieDomain = getCookieDomain(req);
			const cookieOptions = {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax' as const,
				maxAge: 60 * 60 * 24 * 7, // 7 days
				path: '/',
				domain: cookieDomain,
			};

			console.log('[Login API] Setting accessToken cookie with domain:', cookieDomain);
			response.cookies.set('accessToken', accessToken, cookieOptions);

			// Also set user_id if available for middleware to use
			const userId = data.user?.id;
			if (userId) {
				console.log('[Login API] Setting user_id cookie:', userId);
				response.cookies.set('user_id', userId, cookieOptions);
			}
		} else {
			console.warn('[Login API] No access token found in response');
		}

		return response;
	} catch (e) {
		console.error('[Login API] Error:', (e as Error).message);
		return NextResponse.json({ error: (e as Error).message }, { status: 400 });
	}
}


