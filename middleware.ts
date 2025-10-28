import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSubdomainFromRequest } from '@/lib/subdomain-utils'

// Configuration constants
const API_VERSION = "v1"
const MAIN_DOMAIN = "jobboard.com" // Replace with your actual domain
const LOCALHOST_DOMAIN = "localhost"

// Route definitions
const PUBLIC_ROUTES = new Set([
	"/",
	"/login", 
	"/register",
	"/forgot-password",
	"/reset-password",
	"/verify-email",
	"/accept-invitation",
	"/jobs",
	"/careers"
])

const AUTH_ROUTES = new Set([
	"/login",
	"/register", 
	"/forgot-password",
	"/reset-password",
	"/verify-email",
	"/accept-invitation"
])

const PROTECTED_ROUTES = new Set([
	"/employer",
	"/company/onboarding",
	"/company/settings"
])

/**
 * Check if domain is a subdomain pattern
 */
function isSubdomain(domain: string): boolean {
	const subdomain = getSubdomainFromRequest({ nextUrl: { hostname: domain } } as NextRequest)
	return subdomain !== null
}

/**
 * Get user session from Flask backend via cookies
 */
async function getUserSession(request: NextRequest): Promise<{
	user: any | null
	company: any | null
	subdomain: string | null
} | null> {
	try {
		// Check for access token in cookies (set by Flask backend)
		const accessToken = request.cookies.get('accessToken')?.value
		const refreshToken = request.cookies.get('refreshToken')?.value
		
		if (!accessToken) {
			return null
		}
		
		// In a real implementation, you might want to validate the token
		// with your Flask backend or decode JWT if you're using JWT
		// For now, we'll assume the token is valid if it exists
		
		// Extract user info from token or make a request to Flask backend
		// This is a simplified version - you might want to decode JWT or call your API
		return {
			user: { authenticated: true }, // Simplified for now
			company: null,
			subdomain: null
		}
	} catch (error) {
		console.error('[Middleware] Error getting user session:', error)
		return null
	}
}

/**
 * Get associated project/company from subdomain
 */
async function getAssociatedProject(subdomain: string): Promise<string | null> {
	// In your implementation, you might want to:
	// 1. Query your database to get company by subdomain
	// 2. Cache this information
	// 3. Handle custom domains
	
	// For now, return the subdomain as the project slug
	return subdomain
}

export default async function middleware(request: NextRequest) {
	const host = request.headers.get("host") as string
	const domain = host.replace("www.", "").toLowerCase()
	const pathname = request.nextUrl.pathname
	const subdomain = getSubdomainFromRequest(request)
	
	// Build full path with search params
	const searchParams = request.nextUrl.searchParams.toString()
	const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : ""
	const fullPath = `${pathname}${searchParamsString}`

	console.log(`[Middleware] Processing: ${domain}${fullPath}`)

	// Get user session from Flask backend
	const session = await getUserSession(request)
	const user = session?.user
	const userSubdomain = session?.subdomain

	// Handle subdomain routes
	if (subdomain) {
		console.log(`[Middleware] Subdomain detected: ${subdomain}`)
		
		// If no user, always force redirect to sign-in (except for public routes)
		if (!user && !PUBLIC_ROUTES.has(pathname) && !AUTH_ROUTES.has(pathname)) {
			console.log(`[Middleware] No user for subdomain route, redirecting to login`)
			return NextResponse.redirect(new URL("/login", request.url))
		}

		// Handle localhost with default project
		if (user && host.includes("localhost") && !pathname.includes("/login")) {
			// You might want to get the user's default project from their session
			const defaultProject = userSubdomain || "default" // This should come from user data
			console.log(`[Middleware] Localhost with user, redirecting to default project: ${defaultProject}`)
			return NextResponse.rewrite(new URL(`/${defaultProject}${fullPath}`, request.url))
		}

		// Get associated project for this subdomain
		const projectSlug = await getAssociatedProject(subdomain)
		const isProjectMember = user && userSubdomain === projectSlug

		// User has access to this project
		if (user && isProjectMember) {
			console.log(`[Middleware] User has access to project: ${projectSlug}`)
			return NextResponse.rewrite(new URL(`/${projectSlug}${fullPath}`, request.url))
		}

		// User signed-in but not member of project
		if (user && !isProjectMember && !pathname.includes("/login")) {
			console.log(`[Middleware] User not member of project: ${projectSlug}`)
			return NextResponse.redirect(new URL("/login", request.url))
		}

		// Handle subdomain route rewriting for authenticated users
		if (user && !pathname.startsWith('/_subdomain/')) {
			if (pathname.startsWith('/employer')) {
				const newUrl = new URL(`/_subdomain/${subdomain}/employer${pathname.replace('/employer', '')}`, request.url)
				console.log('[Middleware] Rewriting subdomain route:', pathname, '->', newUrl.pathname)
				return NextResponse.rewrite(newUrl)
			}
			
			if (pathname.startsWith('/careers')) {
				const newUrl = new URL(`/_subdomain/${subdomain}/careers${pathname.replace('/careers', '')}`, request.url)
				console.log('[Middleware] Rewriting subdomain route:', pathname, '->', newUrl.pathname)
				return NextResponse.rewrite(newUrl)
			}
		}
	}

	// Handle _subdomain routes - these are internal routes that should be allowed through
	if (pathname.startsWith('/_subdomain/')) {
		console.log('[Middleware] Allowing _subdomain route:', pathname)
		const response = NextResponse.next()
		if (subdomain) {
			response.headers.set('X-Current-Subdomain', subdomain)
		}
		return response
	}

	// Handle authenticated user trying to access auth routes
	if (AUTH_ROUTES.has(pathname)) {
		if (!user) {
			return NextResponse.next()
		}

		console.log('[Middleware] Authenticated user trying to access auth routes, redirecting to home')
		return NextResponse.redirect(new URL("/", request.url))
	}

	// Handle protected routes
	if (PROTECTED_ROUTES.has(pathname) && !user) {
		console.log(`[Middleware] Protected route without user: ${pathname}`)
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}

	// Handle onboarding redirect
	if (user && user.onboarding_completed !== true && pathname !== "/company/onboarding") {
		console.log('[Middleware] User needs onboarding, redirecting')
		return NextResponse.redirect(new URL("/company/onboarding", request.url))
	}

	// Handle default project redirect for authenticated users on main domain
	if (user && userSubdomain && pathname === "/") {
		console.log(`[Middleware] Redirecting to default project: ${userSubdomain}`)
		return NextResponse.redirect(new URL(`https://${userSubdomain}.${MAIN_DOMAIN}`, request.url))
	}

	// Add subdomain to response headers for debugging
	const response = NextResponse.next()
	if (subdomain) {
		response.headers.set('X-Current-Subdomain', subdomain)
	}
	if (user) {
		response.headers.set('X-User-Authenticated', 'true')
	}

	return response
}

// Configure which routes the middleware runs on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api/ (API routes)
		 * - _next/ (Next.js internals)
		 * - _proxy/ (proxies for third-party services)
		 * - _static (inside /public)
		 * - _vercel (Vercel internals)
		 * - Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
		 */
		"/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
	],
}
