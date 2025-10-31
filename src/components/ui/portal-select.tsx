'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
	value: string
	label: string
}

interface PortalSelectProps {
	options: SelectOption[]
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
	error?: string
}

export function PortalSelect({
	options,
	value,
	onChange,
	placeholder = 'Select an option',
	className = '',
	error,
}: PortalSelectProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
	const selectRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const selectedOption = options.find(opt => opt.value === value)

	// Filter options based on search term
	const filteredOptions = options.filter(option =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Update dropdown position when opened
	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			setDropdownPosition({
				top: rect.bottom + window.scrollY + 8,
				left: rect.left + window.scrollX,
				width: rect.width,
			})
		}
	}, [isOpen])

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node
			const isInsideSelect = selectRef.current && selectRef.current.contains(target)
			const isInsideDropdown = dropdownRef.current && dropdownRef.current.contains(target)
			
			if (!isInsideSelect && !isInsideDropdown) {
				setIsOpen(false)
				setSearchTerm('')
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	// Focus input when dropdown opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isOpen])

	// Update position on scroll or resize
	useEffect(() => {
		if (!isOpen) return

		const updatePosition = () => {
			if (buttonRef.current) {
				const rect = buttonRef.current.getBoundingClientRect()
				setDropdownPosition({
					top: rect.bottom + window.scrollY + 8,
					left: rect.left + window.scrollX,
					width: rect.width,
				})
			}
		}

		window.addEventListener('scroll', updatePosition, true)
		window.addEventListener('resize', updatePosition)

		return () => {
			window.removeEventListener('scroll', updatePosition, true)
			window.removeEventListener('resize', updatePosition)
		}
	}, [isOpen])

	const handleSelect = (optionValue: string) => {
		onChange(optionValue)
		setIsOpen(false)
		setSearchTerm('')
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			setIsOpen(false)
			setSearchTerm('')
		}
	}

	const dropdown = isOpen ? (
		<div
			ref={dropdownRef}
			style={{
				position: 'absolute',
				top: `${dropdownPosition.top}px`,
				left: `${dropdownPosition.left}px`,
				width: `${dropdownPosition.width}px`,
				zIndex: 99999,
			}}
			className="rounded-lg border border-white/30 bg-[rgba(17,17,17,0.98)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
		>
			{/* Search Input */}
			<div className="p-2 border-b border-white/10">
				<input
					ref={inputRef}
					type="text"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Search..."
					className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 outline-none focus:bg-white/15 focus:border-white/40"
				/>
			</div>

			{/* Options List */}
			<div className="max-h-60 overflow-y-auto custom-scrollbar">
				{filteredOptions.length > 0 ? (
					filteredOptions.map(option => (
						<button
							key={option.value}
							type="button"
							onClick={() => handleSelect(option.value)}
							className={`w-full px-4 py-3 text-sm text-left transition-colors duration-150 flex items-center justify-between ${
								option.value === value
									? 'bg-gray-900 text-white'
									: 'text-white/90 hover:bg-white/10'
							}`}
						>
							<span>{option.label}</span>
							{option.value === value && (
								<Check className="w-4 h-4 text-white" />
							)}
						</button>
					))
				) : (
					<div className="px-4 py-8 text-center text-white/50 text-sm">
						No options found
					</div>
				)}
			</div>
		</div>
	) : null

	return (
		<div ref={selectRef} className={`relative ${className}`}>
			{/* Select Button */}
			<button
				ref={buttonRef}
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full rounded-md border backdrop-blur-sm px-4 py-3 text-sm text-left outline-none transition-all duration-200 flex items-center justify-between shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] ${
					error
						? 'border-red-400 bg-red-500/10 hover:bg-red-500/15 focus:ring-2 focus:ring-red-400/50 focus:bg-red-500/15 focus:border-red-400'
						: 'border-white/30 bg-white/15 hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:bg-white/20 focus:border-white/50'
				} ${isOpen ? (error ? 'ring-2 ring-red-400/50 bg-red-500/15 border-red-400' : 'ring-2 ring-white/50 bg-white/20 border-white/50') : ''}`}
			>
				<span className={selectedOption ? 'text-white' : 'text-white/60'}>
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<ChevronDown
					className={`w-5 h-5 text-white/80 transition-transform duration-200 ${
						isOpen ? 'transform rotate-180' : ''
					}`}
				/>
			</button>

			{/* Dropdown Menu - Rendered via Portal */}
			{typeof window !== 'undefined' && dropdown && createPortal(dropdown, document.body)}
		</div>
	)
}

// Utility component for form integration
interface FormSelectProps extends PortalSelectProps {
	label?: string
	required?: boolean
}

export function FormPortalSelect({ label, required, error, ...props }: FormSelectProps) {
	return (
		<div>
			{label && (
				<label className="block text-sm font-medium text-white/90 mb-2">
					{label} {required && '*'}
				</label>
			)}
			<PortalSelect {...props} error={error} />
			{error && (
				<p className="text-red-400 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
					{error}
				</p>
			)}
		</div>
	)
}
