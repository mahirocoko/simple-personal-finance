import { z } from 'zod'
import { goalErrors } from '~/lib/zod-i18n'

/**
 * Zod schema for goal form validation
 * Uses i18n for error messages to support multiple languages
 */
export const goalSchema = z
	.object({
		name: z
			.string({ message: goalErrors.nameRequired })
			.trim()
			.min(1, goalErrors.nameRequired)
			.max(100, goalErrors.nameTooLong),

		target_amount: z
			.number({ message: goalErrors.targetAmountNumber })
			.positive(goalErrors.targetAmountPositive)
			.finite(goalErrors.targetAmountValid),

		current_amount: z
			.number({ message: goalErrors.currentAmountNumber })
			.nonnegative(goalErrors.currentAmountNonNegative)
			.finite(goalErrors.currentAmountValid),

		deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, goalErrors.deadlineFormat).optional().or(z.literal('')),
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
			message: goalErrors.currentExceedsTarget,
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
			message: goalErrors.deadlineFuture,
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
