/**
 * Application Configuration
 * Manages environment-specific settings for cookies, domains, etc.
 */

/**
 * Get the cookie domain for setting cookies that work across subdomains
 * 
 * Development: .localhost (allows cookies to work on subdomain.localhost:3000)
 * Production: .yourdomain.com (allows cookies to work on subdomain.yourdomain.com)
 */
export function getCookieDomain(): string {
	if (typeof window === 'undefined') {
		// Server-side: use environment variable or default
		return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.localhost'
	}
	
	// Client-side: determine from hostname
	const hostname = window.location.hostname
	
	// For localhost (including subdomains like company.localhost)
	if (hostname.includes('localhost')) {
		return '.localhost'
	}
	
	// For production domains
	// Extract the root domain (e.g., from app.company.com get .company.com)
	const parts = hostname.split('.')
	if (parts.length >= 2) {
		// Return the last two parts with a leading dot
		// e.g., subdomain.example.com -> .example.com
		return `.${parts.slice(-2).join('.')}`
	}
	
	return hostname
}

/**
 * Get cookie configuration for authentication tokens
 */
export function getCookieConfig() {
	const domain = getCookieDomain()
	const isProduction = process.env.NODE_ENV === 'production'
	
	return {
		domain,
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 7 days
		sameSite: 'Lax' as const,
		secure: isProduction, // Only secure in production
	}
}

/**
 * Format cookie string for document.cookie
 */
export function formatCookieString(name: string, value: string): string {
	const config = getCookieConfig()
	
	return [
		`${name}=${value}`,
		`domain=${config.domain}`,
		`path=${config.path}`,
		`max-age=${config.maxAge}`,
		`SameSite=${config.sameSite}`,
		config.secure ? 'Secure' : '',
	]
		.filter(Boolean)
		.join('; ')
}

/**
 * Format cookie deletion string
 */
export function formatCookieDeletion(name: string): string {
	const domain = getCookieDomain()
	
	return [
		`${name}=`,
		`domain=${domain}`,
		'path=/',
		'expires=Thu, 01 Jan 1970 00:00:00 GMT',
		'SameSite=Lax',
	].join('; ')
}

