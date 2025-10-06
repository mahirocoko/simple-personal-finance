/**
 * Locale types and constants for i18n
 */

export type Locale = 'en' | 'th'

export interface ILocaleConfig {
	code: Locale
	name: string
}

export const SUPPORTED_LOCALES: Record<Locale, string> = {
	en: 'English',
	th: 'ไทย',
} as const

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'locale'
