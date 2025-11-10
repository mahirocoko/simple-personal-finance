import { i18n } from '@lingui/core'
import { messages as enMessages } from '../locales/en/messages'
import { messages as thMessages } from '../locales/th/messages'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../types/locale'
import { getSavedLocale } from '../utils/locale'

// Export locale configuration for components
export const locales = SUPPORTED_LOCALES
export const defaultLocale = DEFAULT_LOCALE

// Load all locale messages
i18n.load({
  en: enMessages,
  th: thMessages,
})

// Activate saved locale or default (with validation)
const savedLocale = getSavedLocale()
i18n.activate(savedLocale)

export { i18n }
