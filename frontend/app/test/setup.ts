import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { i18n } from '@lingui/core'
import { messages as enMessages } from '../locales/en/messages'

// Initialize i18n for tests
i18n.load('en', enMessages)
i18n.activate('en')

// Mock msg macro for tests
vi.mock('@lingui/core/macro', () => ({
	msg: (strings: TemplateStringsArray, ...values: unknown[]) => {
		// Return a message descriptor that i18n can use
		return { id: strings.join(''), message: strings.join(''), values }
	},
}))

// Cleanup after each test
afterEach(() => {
	cleanup()
})
