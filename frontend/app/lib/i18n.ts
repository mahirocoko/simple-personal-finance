import { i18n } from '@lingui/core'
import { messages as enMessages } from '../locales/en/messages'
import { messages as thMessages } from '../locales/th/messages'

export const locales = {
  en: 'English',
  th: 'ไทย',
}

export const defaultLocale = 'en'

// Load all locale messages
i18n.load({
  en: enMessages,
  th: thMessages,
})

// Activate default locale or saved locale from localStorage
const savedLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') : null
i18n.activate(savedLocale || defaultLocale)

export { i18n }
