'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, AlertCircle } from 'lucide-react'

interface LocationAutocompleteProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	error?: string
	className?: string
}

interface Suggestion {
	placeId: string
	description: string
	mainText: string
	secondaryText: string
}

export function LocationAutocomplete({
	value,
	onChange,
	placeholder = 'e.g. San Francisco, CA',
	error,
	className = '',
}: LocationAutocompleteProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [suggestions, setSuggestions] = useState<Suggestion[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isReady, setIsReady] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

	// Check if Google Maps is loaded
	useEffect(() => {
		const checkGoogleMaps = async () => {
			if (typeof window === 'undefined' || !window.google) {
				return false
			}

			try {
				// Try to import the places library (for new API)
				const placesLibrary = await window.google.maps.importLibrary('places') as {
					AutocompleteSuggestion?: unknown
				}
				
				if (placesLibrary?.AutocompleteSuggestion) {
					console.log('AutocompleteSuggestion API is available')
					setIsReady(true)
					return true
				}
			} catch {
				console.log('New Places API not available, checking legacy API')
			}

			// Fallback: Check for legacy API
			if (
				window.google.maps &&
				window.google.maps.places &&
				window.google.maps.places.AutocompleteService
			) {
				console.log('Legacy AutocompleteService is available')
				setIsReady(true)
				return true
			}

			return false
		}

		// Initial check
		checkGoogleMaps()

		// Check periodically until Google Maps is loaded (max 10 seconds)
		let attempts = 0
		const maxAttempts = 100
		const interval = setInterval(async () => {
			attempts++
			const ready = await checkGoogleMaps()
			if (ready || attempts >= maxAttempts) {
				clearInterval(interval)
			}
		}, 100)

		return () => clearInterval(interval)
	}, [])

	// Fetch suggestions using the new AutocompleteSuggestion API or fallback to legacy
	const fetchSuggestions = useCallback(
		async (input: string) => {
			if (!input.trim() || !isReady) {
				setSuggestions([])
				return
			}

			if (typeof window === 'undefined' || !window.google) {
				return
			}

			setIsLoading(true)

			try {
				// Try to use the new AutocompleteSuggestion API
				try {
					const placesLibrary = await window.google.maps.importLibrary('places') as {
						AutocompleteSuggestion?: {
							fetchAutocompleteSuggestions?: (request: { input: string }) => Promise<{
								suggestions?: Array<{
									placePrediction?: {
										placeId?: string
										text?: { text?: string }
										structuredFormat?: { mainText?: string; secondaryText?: string }
									}
									queryPrediction?: {
										text?: { text?: string }
										structuredFormat?: { mainText?: string; secondaryText?: string }
									}
								}>
							}>
						}
					}
					
					const AutocompleteSuggestion = placesLibrary?.AutocompleteSuggestion
					if (AutocompleteSuggestion && typeof AutocompleteSuggestion.fetchAutocompleteSuggestions === 'function') {
						const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
							input: input.trim(),
							// Don't use types restriction to avoid mixing error
							// The API will return relevant suggestions automatically
						})

						if (response && response.suggestions) {
							const formattedSuggestions: Suggestion[] = response.suggestions.map((suggestion) => {
								// Handle both placePrediction and queryPrediction
								const placePred = suggestion.placePrediction
								const queryPred = suggestion.queryPrediction
								
								if (placePred) {
									return {
										placeId: placePred.placeId || '',
										description: placePred.text?.text || '',
										mainText: placePred.structuredFormat?.mainText || placePred.text?.text || '',
										secondaryText: placePred.structuredFormat?.secondaryText || '',
									}
								} else if (queryPred) {
									return {
										placeId: '',
										description: queryPred.text?.text || '',
										mainText: queryPred.structuredFormat?.mainText || queryPred.text?.text || '',
										secondaryText: queryPred.structuredFormat?.secondaryText || '',
									}
								}
								return null
							}).filter((s): s is Suggestion => s !== null)

							setSuggestions(formattedSuggestions)
							setIsOpen(true)
							setIsLoading(false)
							return
						}
					}
				} catch (newApiError) {
					console.log('New AutocompleteSuggestion API not available, using legacy API:', newApiError)
				}

				// Fallback to legacy AutocompleteService
				const places = window.google.maps.places
				if (places && typeof places.AutocompleteService === 'function') {
					const service = new places.AutocompleteService()
					// Remove types restriction to avoid mixing error - let API return all relevant results
					const request: google.maps.places.AutocompletionRequest = {
						input: input.trim(),
						// Don't specify types to avoid "(cities) cannot be mixed with other types" error
					}

					service.getPlacePredictions(request, (predictions, status) => {
						setIsLoading(false)

						if (
							status === window.google.maps.places.PlacesServiceStatus.OK &&
							predictions
						) {
							const formattedSuggestions: Suggestion[] = predictions.map((pred) => ({
								placeId: pred.place_id || '',
								description: pred.description || '',
								mainText:
									pred.structured_formatting?.main_text || pred.description || '',
								secondaryText: pred.structured_formatting?.secondary_text || '',
							}))

							setSuggestions(formattedSuggestions)
							setIsOpen(true)
						} else if (
							status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
						) {
							setSuggestions([])
							setIsOpen(true)
						} else {
							console.warn('AutocompleteService status:', status)
							setSuggestions([])
						}
					})
				} else {
					console.error('Neither AutocompleteSuggestion nor AutocompleteService is available')
					setIsLoading(false)
					setSuggestions([])
				}
			} catch (error) {
				console.error('Error fetching suggestions:', error)
				setIsLoading(false)
				setSuggestions([])
			}
		},
		[isReady]
	)

	// Debounced input handler
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		onChange(newValue)

		// Clear previous debounce timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current)
		}

		// Set new debounce timer
		debounceTimerRef.current = setTimeout(() => {
			fetchSuggestions(newValue)
		}, 300)
	}

	const handleSelect = useCallback(
		(suggestion: Suggestion) => {
			const selectedText = suggestion.description || suggestion.mainText
			onChange(selectedText)
			setIsOpen(false)
			setSuggestions([])

			// Optionally get place details if needed
			if (
				suggestion.placeId &&
				typeof window !== 'undefined' &&
				window.google?.maps
			) {
				try {
					const geocoder = new window.google.maps.Geocoder()
					geocoder.geocode({ placeId: suggestion.placeId }, (results, status) => {
						if (status === window.google.maps.GeocoderStatus.OK && results?.[0]) {
							const location = results[0].geometry?.location
							console.log('Selected location:', {
								description: selectedText,
								placeId: suggestion.placeId,
								location: location
									? { lat: location.lat(), lng: location.lng() }
									: null,
							})
						}
					})
				} catch (error) {
					console.error('Error fetching place details:', error)
				}
			}
		},
		[onChange]
	)

	const handleInputFocus = () => {
		if (suggestions.length > 0 && value.trim()) {
			setIsOpen(true)
		} else if (value.trim()) {
			// Fetch suggestions if we have input on focus
			fetchSuggestions(value)
		}
	}

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			setIsOpen(false)
			setSuggestions([])
		}
	}

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// Cleanup debounce timer
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current)
			}
		}
	}, [])

	const baseInputClasses =
		'w-full rounded-lg border backdrop-blur-sm px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition-all duration-200'
	const normalClasses =
		'border-white/30 bg-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/15 focus:border-indigo-500/50'
	const errorClasses =
		'border-red-400 bg-red-500/10 focus:ring-2 focus:ring-red-400/50 focus:bg-red-500/15 focus:border-red-400'

	const inputClasses = `${baseInputClasses} ${error ? errorClasses : normalClasses} ${className}`

	return (
		<div ref={containerRef} className="relative">
			<div className="relative">
				<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
				<input
					ref={inputRef}
					value={value}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					onKeyDown={handleInputKeyDown}
					disabled={!isReady}
					className={`${inputClasses} pl-10`}
					placeholder={placeholder}
				/>
				{isLoading && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/40" />
					</div>
				)}
			</div>

			{error && (
				<p className="text-red-400 text-sm mt-1 flex items-center gap-1">
					<AlertCircle className="w-4 h-4" />
					{error}
				</p>
			)}

			{!isReady && (
				<p className="text-white/50 text-xs mt-1">
					Loading Google Maps... (Make sure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set)
				</p>
			)}

			{isOpen && suggestions.length > 0 && (
				<div className="absolute z-[9999] w-full mt-2 bg-black/95 backdrop-blur-xl border border-white/40 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
					{suggestions.map((suggestion, index) => (
						<button
							key={suggestion.placeId || index}
							type="button"
							onClick={() => handleSelect(suggestion)}
							className="w-full text-left px-4 py-3 hover:bg-white/20 transition-colors border-b border-white/30 last:border-b-0"
						>
							<div className="text-white text-sm font-medium">
								{suggestion.mainText}
							</div>
							{suggestion.secondaryText && (
								<div className="text-white/80 text-xs mt-0.5">
									{suggestion.secondaryText}
								</div>
							)}
						</button>
					))}
				</div>
			)}

			{isOpen && suggestions.length === 0 && value.trim() && !isLoading && isReady && (
				<div className="absolute z-[9999] w-full mt-2 bg-black/95 backdrop-blur-xl border border-white/40 rounded-lg shadow-2xl p-4">
					<p className="text-white/80 text-sm">No places found</p>
				</div>
			)}
		</div>
	)
}
