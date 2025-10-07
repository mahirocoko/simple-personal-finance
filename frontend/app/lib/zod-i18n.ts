import { i18n } from '@lingui/core'
import { msg } from '@lingui/core/macro'

/**
 * Helper functions for translated Zod error messages
 * Using Lingui's msg() macro for compile-time message extraction
 *
 * IMPORTANT: These functions must be called at runtime (not at module load time)
 * to ensure i18n is properly initialized with the current locale
 */

// Common validation messages
export const zodErrors = {
	// Number validation
	get numberRequired() {
		return i18n._(msg`Must be a number`)
	},
	get positiveNumber() {
		return i18n._(msg`Must be greater than 0`)
	},
	get nonNegativeNumber() {
		return i18n._(msg`Cannot be negative`)
	},
	get finiteNumber() {
		return i18n._(msg`Must be a valid number`)
	},
	get integerRequired() {
		return i18n._(msg`Must be a whole number`)
	},

	// String validation
	get stringRequired() {
		return i18n._(msg`This field is required`)
	},
	stringTooLong: (max: number) => i18n._(msg`Must be less than ${max} characters`),
	stringTooShort: (min: number) => i18n._(msg`Must be at least ${min} characters`),

	// Date validation
	get dateRequired() {
		return i18n._(msg`Date is required`)
	},
	get dateFormat() {
		return i18n._(msg`Date must be in YYYY-MM-DD format`)
	},
	get dateFuture() {
		return i18n._(msg`Date must be in the future`)
	},

	// Enum validation
	enumInvalid: (options: string) => i18n._(msg`Must be one of: ${options}`),

	// Custom messages
	get required() {
		return i18n._(msg`This field is required`)
	},
}

// Transaction-specific error messages
export const transactionErrors = {
	get amountNumber() {
		return i18n._(msg`Amount must be a number`)
	},
	get amountPositive() {
		return i18n._(msg`Amount must be greater than 0`)
	},
	get amountValid() {
		return i18n._(msg`Amount must be a valid number`)
	},
	get typeInvalid() {
		return i18n._(msg`Type must be either income or expense`)
	},
	get categoryRequired() {
		return i18n._(msg`Category must be selected`)
	},
	get categoryValid() {
		return i18n._(msg`Category must be a valid ID`)
	},
	get descriptionTooLong() {
		return i18n._(msg`Description must be less than 200 characters`)
	},
	get dateRequired() {
		return i18n._(msg`Date is required`)
	},
	get dateFormat() {
		return i18n._(msg`Date must be in YYYY-MM-DD format`)
	},
}

// Goal-specific error messages
export const goalErrors = {
	get nameRequired() {
		return i18n._(msg`Goal name is required`)
	},
	get nameTooLong() {
		return i18n._(msg`Goal name must be less than 100 characters`)
	},
	get targetAmountNumber() {
		return i18n._(msg`Target amount must be a number`)
	},
	get targetAmountPositive() {
		return i18n._(msg`Target amount must be greater than 0`)
	},
	get targetAmountValid() {
		return i18n._(msg`Target amount must be a valid number`)
	},
	get currentAmountNumber() {
		return i18n._(msg`Current amount must be a number`)
	},
	get currentAmountNonNegative() {
		return i18n._(msg`Current amount cannot be negative`)
	},
	get currentAmountValid() {
		return i18n._(msg`Current amount must be a valid number`)
	},
	get currentExceedsTarget() {
		return i18n._(msg`Current amount cannot exceed target amount`)
	},
	get deadlineFormat() {
		return i18n._(msg`Deadline must be in YYYY-MM-DD format`)
	},
	get deadlineFuture() {
		return i18n._(msg`Deadline must be in the future`)
	},
}
