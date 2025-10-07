import { z } from 'zod'
import { transactionErrors } from '~/lib/zod-i18n'

/**
 * Zod schema for transaction form validation
 * Uses i18n for error messages to support multiple languages
 */
export const transactionSchema = z.object({
	amount: z
		.number({ message: transactionErrors.amountNumber })
		.positive(transactionErrors.amountPositive)
		.finite(transactionErrors.amountValid),

	type: z.enum(['income', 'expense'], { message: transactionErrors.typeInvalid }),

	category_id: z
		.number({ message: transactionErrors.categoryRequired })
		.int(transactionErrors.categoryValid)
		.positive(transactionErrors.categoryRequired),

	description: z.string().max(200, transactionErrors.descriptionTooLong).optional().or(z.literal('')),

	date: z
		.string({ message: transactionErrors.dateRequired })
		.regex(/^\d{4}-\d{2}-\d{2}$/, transactionErrors.dateFormat),
})

/**
 * TypeScript type inferred from Zod schema
 */
export type TransactionFormData = z.infer<typeof transactionSchema>

/**
 * Schema for creating a new transaction (API payload)
 */
export const createTransactionSchema = transactionSchema

/**
 * Schema for updating an existing transaction (API payload)
 * All fields are optional for partial updates
 */
export const updateTransactionSchema = transactionSchema.partial()
