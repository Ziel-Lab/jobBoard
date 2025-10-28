import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Extract access token from Next.js API request
 * Checks both cookies (server-side, HttpOnly) and Authorization header (client-side)
 * 
 * Usage in API routes:
 * ```ts
 * import { getAccessTokenFromRequest } from '@/lib/api-auth-helpers'
 * 
 * export async function GET(request: NextRequest) {
 *   const accessToken = await getAccessTokenFromRequest(request)
 *   if (!accessToken) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *   // Use accessToken...
 * }
 * ```
 */
export async function getAccessTokenFromRequest(request: NextRequest): Promise<string | null> {
	console.log('[API Auth] Getting access token from request')
	
	// First, try to get from cookies (server-side, HttpOnly)
	const cookieStore = await cookies()
	const tokenFromCookie = cookieStore.get('accessToken')?.value
	
	if (tokenFromCookie) {
		console.log('[API Auth] Found access token in cookies')
		return tokenFromCookie
	}
	
	// Log all available cookies for debugging
	const allCookies = cookieStore.getAll()
	console.log('[API Auth] Available cookies:', allCookies.map(c => c.name).join(', '))
	
	// Fallback: try to get from Authorization header (client-side)
	const authHeader = request.headers.get('Authorization')
	if (authHeader && authHeader.startsWith('Bearer ')) {
		console.log('[API Auth] Found access token in Authorization header')
		return authHeader.substring(7)
	}
	
	console.log('[API Auth] No access token found')
	return null
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

