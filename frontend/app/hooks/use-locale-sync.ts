import { useEffect } from 'react'
import { i18n } from '~/lib/i18n'
import { LOCALE_STORAGE_KEY } from '~/types/locale'
import { isValidLocale } from '~/utils/locale'

/**
 * Hook to synchronize locale changes across browser tabs
 * Listens to localStorage changes and updates i18n accordingly
 */
export function useLocaleSync() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') {
      return
    }

    const handleStorageChange = (event: StorageEvent) => {
      // Only handle locale changes
      if (event.key !== LOCALE_STORAGE_KEY) {
        return
      }

      const newLocale = event.newValue

      // Validate and activate new locale
      if (newLocale && isValidLocale(newLocale)) {
        // Only update if different from current
        if (i18n.locale !== newLocale) {
          i18n.activate(newLocale)
        }
      }
    }

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
}
