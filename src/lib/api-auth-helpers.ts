import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Forward authentication cookies from the incoming request to the backend.
 * This properly handles HttpOnly cookies set by the backend without exposing them to JavaScript.
 * 
 * Usage in API routes:
 * ```ts
 * import { getForwardedCookies, hasAuthCookies } from '@/lib/api-auth-helpers'
 * 
 * export async function GET(request: NextRequest) {
 *   if (!await hasAuthCookies()) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *   
 *   const response = await fetch(`${API_BASE_URL}/endpoint`, {
 *     headers: {
 *       'Cookie': await getForwardedCookies(),
 *       // ... other headers
 *     },
 *   })
 * }
 * ```
 */

/**
 * Get cookies from the request as a Cookie header string to forward to backend.
 * This allows the backend to read HttpOnly cookies directly.
 */
export async function getForwardedCookies(): Promise<string> {
	const cookieStore = await cookies()
	const allCookies = cookieStore.getAll()
	
	// Format cookies as "name=value; name2=value2"
	const cookieHeader = allCookies
		.map(cookie => `${cookie.name}=${cookie.value}`)
		.join('; ')
	
	console.log('[API Auth] Forwarding cookies:', allCookies.map(c => c.name).join(', '))
	
	return cookieHeader
}

/**
 * Check if auth cookies (accessToken or refreshToken) are present.
 * Use this to verify authentication before forwarding requests.
 */
export async function hasAuthCookies(): Promise<boolean> {
	const cookieStore = await cookies()
	const hasAccessToken = !!cookieStore.get('accessToken')?.value
	const hasRefreshToken = !!cookieStore.get('refreshToken')?.value
	
	const authenticated = hasAccessToken || hasRefreshToken
	
	if (!authenticated) {
		const allCookies = cookieStore.getAll()
		console.log('[API Auth] No auth cookies found. Available cookies:', allCookies.map(c => c.name).join(', '))
	}
	
	return authenticated
}

/**
 * Create standard unauthorized response
 */
export function unauthorizedResponse() {
	return {
		success: false,
		message: 'Unauthorized - Please log in again',
	}
}

