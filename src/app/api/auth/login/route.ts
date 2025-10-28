import { NextResponse } from 'next/server'
import { getCookieDomain } from '@/lib/subdomain-utils'
import type { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api'

export async function POST(req: NextRequest) {
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


