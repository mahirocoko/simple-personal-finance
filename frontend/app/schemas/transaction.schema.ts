import { z } from 'zod'

/**
 * Zod schema for transaction form validation
 */
export const transactionSchema = z.object({
	amount: z
		.number({ message: 'Amount must be a number' })
		.positive('Amount must be greater than 0')
		.finite('Amount must be a valid number'),

	type: z.enum(['income', 'expense'], { message: 'Type must be either income or expense' }),

	category_id: z
		.number({ message: 'Category must be selected' })
		.int('Category must be a valid ID')
		.positive('Category must be selected'),

	description: z.string().max(200, 'Description must be less than 200 characters').optional().or(z.literal('')),

	date: z.string({ message: 'Date is required' }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
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
