'use client'

import { LoadScript } from '@react-google-maps/api'
import { ReactNode } from 'react'

interface GoogleMapsLoaderProps {
	children: ReactNode
}

export function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

	if (!apiKey) {
		console.warn(
			'Google Maps API key not found. Location autocomplete will not work. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.'
		)
		return <>{children}</>
	}

	return (
		<LoadScript
			id="google-maps-loader"
			googleMapsApiKey={apiKey}
			libraries={['places']}
			loadingElement={<></>}
			onError={(error) => {
				console.error('Error loading Google Maps API:', error)
			}}
			onLoad={() => {
				console.log('Google Maps Places API loaded successfully')
			}}
		>
			{children}
		</LoadScript>
	)
}

