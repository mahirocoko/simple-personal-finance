import { z } from 'zod'

/**
 * Zod schema for goal form validation
 */
export const goalSchema = z
	.object({
		name: z
			.string({
				required_error: 'Goal name is required',
			})
			.min(1, 'Goal name is required')
			.max(100, 'Goal name must be less than 100 characters')
			.trim(),

		target_amount: z
			.number({
				required_error: 'Target amount is required',
				invalid_type_error: 'Target amount must be a number',
			})
			.positive('Target amount must be greater than 0')
			.finite('Target amount must be a valid number'),

		current_amount: z
			.number({
				invalid_type_error: 'Current amount must be a number',
			})
			.nonnegative('Current amount cannot be negative')
			.finite('Current amount must be a valid number')
			.default(0),

		deadline: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in YYYY-MM-DD format')
			.optional()
			.or(z.literal('')),
	})
	.refine(
		(data) => {
			// Validate current_amount <= target_amount
			if (data.current_amount > data.target_amount) {
				return false
			}
			return true
		},
		{
			message: 'Current amount cannot exceed target amount',
			path: ['current_amount'],
		},
	)
	.refine(
		(data) => {
			// Validate deadline is in the future
			if (data.deadline && data.deadline !== '') {
				const deadlineDate = new Date(data.deadline)
				const today = new Date()
				today.setHours(0, 0, 0, 0) // Reset time to start of day

				if (deadlineDate < today) {
					return false
				}
			}
			return true
		},
		{
			message: 'Deadline must be in the future',
			path: ['deadline'],
		},
	)

/**
 * TypeScript type inferred from Zod schema
 */
export type GoalFormData = z.infer<typeof goalSchema>

/**
 * Schema for creating a new goal (API payload)
 */
export const createGoalSchema = goalSchema

/**
 * Schema for updating an existing goal (API payload)
 * All fields are optional for partial updates
 */
export const updateGoalSchema = goalSchema.partial()
