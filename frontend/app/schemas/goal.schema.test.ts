import { describe, expect, it } from 'vitest'
import { goalSchema } from './goal.schema'

describe('goalSchema', () => {
	describe('valid goals', () => {
		it('should accept valid goal with all fields', () => {
			const validGoal = {
				name: 'Buy a new car',
				target_amount: 50000,
				current_amount: 10000,
				deadline: '2026-12-31',
			}

			const result = goalSchema.safeParse(validGoal)
			expect(result.success).toBe(true)
		})

		it('should accept valid goal without deadline', () => {
			const validGoal = {
				name: 'Emergency fund',
				target_amount: 100000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(validGoal)
			expect(result.success).toBe(true)
		})

		it('should accept goal with current_amount equal to target_amount', () => {
			const validGoal = {
				name: 'Completed goal',
				target_amount: 5000,
				current_amount: 5000,
				deadline: '',
			}

			const result = goalSchema.safeParse(validGoal)
			expect(result.success).toBe(true)
		})
	})

	describe('name validation', () => {
		it('should reject empty name', () => {
			const invalid = {
				name: '',
				target_amount: 10000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should trim whitespace and reject if empty after trim', () => {
			const invalid = {
				name: '   ',
				target_amount: 10000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			// After trim(), '   ' becomes '', which fails min(1) check
			expect(result.success).toBe(false)
		})

		it('should reject name over 100 characters', () => {
			const invalid = {
				name: 'a'.repeat(101),
				target_amount: 10000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should accept name at exactly 100 characters', () => {
			const valid = {
				name: 'a'.repeat(100),
				target_amount: 10000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(valid)
			expect(result.success).toBe(true)
		})

		it('should trim whitespace from name', () => {
			const goal = {
				name: '  My Goal  ',
				target_amount: 10000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(goal)
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data.name).toBe('My Goal')
			}
		})
	})

	describe('target_amount validation', () => {
		it('should reject non-number target_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 'invalid',
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should reject zero target_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 0,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should reject negative target_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: -1000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should reject infinity target_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: Number.POSITIVE_INFINITY,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})
	})

	describe('current_amount validation', () => {
		it('should reject non-number current_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: 'invalid',
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should reject negative current_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: -500,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should accept zero current_amount', () => {
			const valid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(valid)
			expect(result.success).toBe(true)
		})

		it('should reject infinity current_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: Number.POSITIVE_INFINITY,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})
	})

	describe('current_amount vs target_amount refinement', () => {
		it('should reject current_amount exceeding target_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 5000,
				current_amount: 6000,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('current_amount')
			}
		})
	})

	describe('deadline validation', () => {
		it('should reject invalid date format', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: 0,
				deadline: '31/12/2026',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should reject partial date', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: 0,
				deadline: '2026-12',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should reject past deadline', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: 0,
				deadline: '2020-01-01',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('deadline')
			}
		})

		it('should accept future deadline', () => {
			const valid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: 0,
				deadline: '2030-12-31',
			}

			const result = goalSchema.safeParse(valid)
			expect(result.success).toBe(true)
		})

		it('should accept empty deadline', () => {
			const valid = {
				name: 'Goal',
				target_amount: 10000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(valid)
			expect(result.success).toBe(true)
		})
	})

	describe('missing required fields', () => {
		it('should reject missing name', () => {
			const invalid = {
				target_amount: 10000,
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should reject missing target_amount', () => {
			const invalid = {
				name: 'Goal',
				current_amount: 0,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})

		it('should reject missing current_amount', () => {
			const invalid = {
				name: 'Goal',
				target_amount: 10000,
				deadline: '',
			}

			const result = goalSchema.safeParse(invalid)
			expect(result.success).toBe(false)
		})
	})
})
