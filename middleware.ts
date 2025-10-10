import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of protected routes that require authentication
const protectedRoutes = [
	'/employer',
	'/company/onboarding'
]

/**
 * Extract subdomain from request
 */
function getSubdomainFromRequest(request: NextRequest): string | null {
	const hostname = request.nextUrl.hostname
	
	// No subdomain on plain localhost or IP
	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		return null
	}
	
	// Handle *.localhost (e.g., company.localhost)
	if (hostname.endsWith('.localhost')) {
		const subdomain = hostname.replace('.localhost', '')
		return subdomain || null
	}
	
	// Handle production domains (e.g., company.yourdomain.com)
	const parts = hostname.split('.')
	
	// Need at least 3 parts for a subdomain (subdomain.domain.com)
	if (parts.length >= 3) {
		return parts[0]
	}
	
	return null
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	
	// Check if the current route is protected
	const isProtectedRoute = protectedRoutes.some((route) => 
		pathname.startsWith(route)
	)
	
	if (isProtectedRoute) {
		// Check for access token in cookies
		const accessToken = request.cookies.get('accessToken')?.value
		
		if (!accessToken) {
			// No token found, redirect to login on main domain
			const subdomain = getSubdomainFromRequest(request)
			
			// If on subdomain, redirect to main domain for login
			if (subdomain) {
				// Build main domain URL
				const protocol = request.nextUrl.protocol
				const port = request.nextUrl.port
				const mainDomain = request.nextUrl.hostname.includes('localhost')
					? 'localhost'
					: request.nextUrl.hostname.split('.').slice(-2).join('.')
				
				const loginUrl = new URL(
					`${protocol}//${mainDomain}${port ? `:${port}` : ''}/login`
				)
				loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
				
				return NextResponse.redirect(loginUrl)
			}
			
			// Already on main domain, redirect to login
			const loginUrl = new URL('/login', request.url)
			loginUrl.searchParams.set('redirect', pathname)
			return NextResponse.redirect(loginUrl)
		}
		
		// User is authenticated
		// Add subdomain to response headers for debugging
		const response = NextResponse.next()
		const subdomain = getSubdomainFromRequest(request)
		if (subdomain) {
			response.headers.set('X-Current-Subdomain', subdomain)
		}
		
		return response
	}
	
	return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public directory)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
	],
}
