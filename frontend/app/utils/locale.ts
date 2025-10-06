import type { Locale } from '../types/locale'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from '../types/locale'

/**
 * Type guard to check if a string is a valid locale
 */
export function isValidLocale(value: unknown): value is Locale {
	return typeof value === 'string' && value in SUPPORTED_LOCALES
}

/**
 * Safely get locale from localStorage with fallback
 * Returns DEFAULT_LOCALE if:
 * - localStorage is unavailable (SSR, private mode)
 * - Stored value is invalid
 * - No value is stored
 */
export function getSavedLocale(): Locale {
	// Check if we're in browser environment
	if (typeof window === 'undefined') {
		return DEFAULT_LOCALE
	}

	try {
		const saved = localStorage.getItem(LOCALE_STORAGE_KEY)

		if (saved && isValidLocale(saved)) {
			return saved
		}
	} catch (error) {
		// localStorage might be unavailable (private mode, permissions)
		console.warn('Failed to read locale from localStorage:', error)
	}

	return DEFAULT_LOCALE
}

/**
 * Safely save locale to localStorage
 * Validates locale before saving
 */
export function saveLocale(locale: Locale): void {
	// Check if we're in browser environment
	if (typeof window === 'undefined') {
		return
	}

	// Validate locale
	if (!isValidLocale(locale)) {
		console.error(`Invalid locale: ${locale}. Using default.`)
		return
	}

	try {
		localStorage.setItem(LOCALE_STORAGE_KEY, locale)
	} catch (error) {
		// localStorage might be unavailable or full
		console.warn('Failed to save locale to localStorage:', error)
	}
}

/**
 * Clear saved locale from localStorage
 */
export function clearSavedLocale(): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.removeItem(LOCALE_STORAGE_KEY)
	} catch (error) {
		console.warn('Failed to clear locale from localStorage:', error)
	}
}
