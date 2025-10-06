import { i18n } from '@lingui/core'
import { messages as enMessages } from '../locales/en/messages'

export const locales = {
  en: 'English',
  th: 'ไทย',
}

export const defaultLocale = 'en'

// Load default locale messages
i18n.load(defaultLocale, enMessages)
i18n.activate(defaultLocale)

export { i18n }
