import React from 'react'
import { notFound } from 'next/navigation'

interface SubdomainLayoutProps {
	children: React.ReactNode
	params: {
		subdomain: string
	}
}

// This layout handles all subdomain routes
export default function SubdomainLayout({ children, params }: SubdomainLayoutProps) {
	const { subdomain } = params
	
	// Validate subdomain format
	if (!subdomain || subdomain.length === 0) {
		notFound()
	}
	
	// Basic subdomain validation (alphanumeric and hyphens only)
	const subdomainPattern = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/
	if (!subdomainPattern.test(subdomain)) {
		notFound()
	}
	
	return (
		<div className="subdomain-layout">
			{children}
		</div>
	)
}

// Generate metadata for subdomain pages
export function generateMetadata({ params }: { params: { subdomain: string } }) {
	return {
		title: `${params.subdomain} - Job Board`,
		description: `Company job board for ${params.subdomain}`,
	}
}
