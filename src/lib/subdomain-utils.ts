import { NextRequest } from 'next/server'

/**
 * Consistent subdomain detection utility used across middleware and API routes
 * This ensures the same logic is used everywhere
 */
export function getSubdomainFromRequest(request: NextRequest): string | null {
	const hostname = request.nextUrl.hostname.toLowerCase()
	
	console.log('[Subdomain Utils] Detecting subdomain for hostname:', hostname)
	
	// Handle localhost development
	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		console.log('[Subdomain Utils] Plain localhost/IP detected, no subdomain')
		return null
	}
	
	// Handle *.localhost (e.g., company.localhost)
	if (hostname.endsWith('.localhost')) {
		const subdomain = hostname.replace('.localhost', '')
		console.log('[Subdomain Utils] Localhost subdomain detected:', subdomain)
		return subdomain || null
	}
	
	// Handle production domains (e.g., company.jobboard.com)
	const parts = hostname.split('.')
	
	// Need at least 3 parts for a subdomain (subdomain.domain.com)
	if (parts.length >= 3) {
		const potentialSubdomain = parts[0]
		// Skip www as it's not a real subdomain
		if (potentialSubdomain !== 'www') {
			console.log('[Subdomain Utils] Production subdomain detected:', potentialSubdomain)
			return potentialSubdomain
		}
	}
	
	console.log('[Subdomain Utils] No subdomain detected')
	return null
}

/**
 * Get cookie domain for subdomain support
 * Returns .localhost for development or .yourdomain.com for production
 */
export function getCookieDomain(request: NextRequest): string | undefined {
	const hostname = request.nextUrl.hostname.toLowerCase()
	
	console.log('[Subdomain Utils] Setting cookie for hostname:', hostname)
	
	// For localhost:
	// - If on plain 'localhost', do NOT set a domain (host-only cookie)
	// - If on '*.localhost' (e.g., company.localhost), set domain to '.localhost'
	if (hostname === 'localhost') {
		console.log('[Subdomain Utils] Plain localhost detected, not setting domain')
		return undefined
	}
	if (hostname.endsWith('.localhost')) {
		console.log('[Subdomain Utils] Subdomain on localhost detected, using domain .localhost')
		return '.localhost'
	}
	
	// For IP addresses like 127.0.0.1, don't set domain
	if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
		console.log('[Subdomain Utils] IP address detected, not setting domain')
		return undefined
	}
	
	// For production domains - extract root domain
	const parts = hostname.split('.')
	if (parts.length >= 2) {
		// Return the last two parts with a leading dot
		const domain = `.${parts.slice(-2).join('.')}`
		console.log('[Subdomain Utils] Using cookie domain:', domain)
		return domain
	}
	
	return undefined
}

/**
 * Check if domain is a subdomain pattern
 */
export function isSubdomain(domain: string): boolean {
	const subdomain = getSubdomainFromRequest({ nextUrl: { hostname: domain } } as NextRequest)
	return subdomain !== null
}

/**
 * Get current subdomain from browser (client-side)
 * This is used in client-side code to get the current subdomain
 */
export function getCurrentSubdomain(): string | null {
	if (typeof window === 'undefined') {
		return null
	}
	
	const hostname = window.location.hostname.toLowerCase()
	
	// Handle localhost development
	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		return null
	}
	
	// Handle *.localhost (e.g., company.localhost)
	if (hostname.endsWith('.localhost')) {
		const subdomain = hostname.replace('.localhost', '')
		return subdomain || null
	}
	
	// Handle production domains (e.g., company.jobboard.com)
	const parts = hostname.split('.')
	
	// Need at least 3 parts for a subdomain (subdomain.domain.com)
	if (parts.length >= 3) {
		const potentialSubdomain = parts[0]
		// Skip www as it's not a real subdomain
		if (potentialSubdomain !== 'www') {
			return potentialSubdomain
		}
	}
	
	return null
}

/**
 * Build subdomain URL for client-side usage
 * This function constructs URLs with the current subdomain
 */
export function buildSubdomainUrl(path: string = '', subdomain?: string): string {
	if (typeof window === 'undefined') {
		return path
	}
	
	const currentSubdomain = subdomain || getCurrentSubdomain()
	const hostname = window.location.hostname.toLowerCase()
	const protocol = window.location.protocol
	const port = window.location.port ? `:${window.location.port}` : ''
	
	// If we have a subdomain, construct the subdomain URL
	if (currentSubdomain) {
		// Handle localhost development
		if (hostname.includes('localhost')) {
			return `${protocol}//${currentSubdomain}.localhost${port}${path}`
		}
		
		// Handle production domains
		const parts = hostname.split('.')
		if (parts.length >= 2) {
			const domain = parts.slice(-2).join('.')
			return `${protocol}//${currentSubdomain}.${domain}${port}${path}`
		}
	}
	
	// Fallback to current URL with path
	return `${protocol}//${hostname}${port}${path}`
}