'use client'

/**
 * Subdomain Utility Functions
 * Handles extraction and validation of company subdomains
 */

/**
 * Extract subdomain from current URL
 * Returns null if on main domain (no subdomain)
 * 
 * Examples:
 * - localhost:3000 → null
 * - company-abc.localhost:3000 → "company-abc"
 * - subdomain.yourdomain.com → "subdomain"
 */
export function getCurrentSubdomain(): string | null {
	if (typeof window === 'undefined') {
		return null
	}
	
	const hostname = window.location.hostname
	
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
	
	// No subdomain detected
	return null
}

/**
 * Check if currently on a company subdomain
 */
export function isOnSubdomain(): boolean {
	return getCurrentSubdomain() !== null
}

/**
 * Get the main domain URL (without subdomain)
 */
export function getMainDomainUrl(): string {
	if (typeof window === 'undefined') {
		return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
	}
	
	const hostname = window.location.hostname
	const protocol = window.location.protocol
	const port = window.location.port
	
	// For localhost
	if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
		return `${protocol}//localhost${port ? `:${port}` : ''}`
	}
	
	// For production - extract root domain
	const parts = hostname.split('.')
	if (parts.length >= 2) {
		const rootDomain = parts.slice(-2).join('.')
		return `${protocol}//${rootDomain}${port ? `:${port}` : ''}`
	}
	
	return `${protocol}//${hostname}${port ? `:${port}` : ''}`
}

/**
 * Build subdomain URL
 */
export function buildSubdomainUrl(subdomain: string, path: string = '/'): string {
	const mainUrl = getMainDomainUrl()
	const urlObj = new URL(mainUrl)
	
	// For localhost
	if (urlObj.hostname === 'localhost') {
		urlObj.hostname = `${subdomain}.localhost`
	} else {
		// For production
		urlObj.hostname = `${subdomain}.${urlObj.hostname}`
	}
	
	urlObj.pathname = path
	
	return urlObj.toString()
}

/**
 * Validate subdomain format
 * Backend validates: ^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$
 */
export function isValidSubdomain(subdomain: string): boolean {
	if (!subdomain || subdomain.length === 0 || subdomain.length > 63) {
		return false
	}
	
	const pattern = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/
	return pattern.test(subdomain)
}

/**
 * Redirect to correct subdomain
 * Used when user is on wrong subdomain
 */
export function redirectToCorrectSubdomain(subdomain: string, path: string = '/employer') {
	if (typeof window === 'undefined') return
	
	const targetUrl = buildSubdomainUrl(subdomain, path)
	window.location.href = targetUrl
}

/**
 * Redirect to main domain
 */
export function redirectToMainDomain(path: string = '/') {
	if (typeof window === 'undefined') return
	
	const mainUrl = getMainDomainUrl()
	window.location.href = `${mainUrl}${path}`
}

