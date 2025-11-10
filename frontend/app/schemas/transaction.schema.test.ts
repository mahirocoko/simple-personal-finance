import { describe, expect, it } from 'vitest'
import { transactionSchema } from './transaction.schema'

describe('transactionSchema', () => {
  describe('valid transactions', () => {
    it('should accept valid expense transaction', () => {
      const validExpense = {
        amount: 100,
        type: 'expense' as const,
        category_id: 1,
        description: 'Lunch',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(validExpense)
      expect(result.success).toBe(true)
    })

    it('should accept valid income transaction', () => {
      const validIncome = {
        amount: 5000,
        type: 'income' as const,
        category_id: 2,
        description: 'Salary',
        date: '2025-01-01',
      }

      const result = transactionSchema.safeParse(validIncome)
      expect(result.success).toBe(true)
    })

    it('should accept transaction with empty description', () => {
      const validTransaction = {
        amount: 50.5,
        type: 'expense' as const,
        category_id: 3,
        description: '',
        date: '2025-03-20',
      }

      const result = transactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })
  })

  describe('amount validation', () => {
    it('should reject non-number amount', () => {
      const invalid = {
        amount: 'invalid',
        type: 'expense' as const,
        category_id: 1,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject zero amount', () => {
      const invalid = {
        amount: 0,
        type: 'expense' as const,
        category_id: 1,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject negative amount', () => {
      const invalid = {
        amount: -50,
        type: 'expense' as const,
        category_id: 1,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject infinity amount', () => {
      const invalid = {
        amount: Number.POSITIVE_INFINITY,
        type: 'expense' as const,
        category_id: 1,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('type validation', () => {
    it('should reject invalid type', () => {
      const invalid = {
        amount: 100,
        type: 'invalid',
        category_id: 1,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('category_id validation', () => {
    it('should reject non-number category_id', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 'invalid',
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject zero category_id', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 0,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject negative category_id', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        category_id: -1,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject decimal category_id', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 1.5,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('description validation', () => {
    it('should reject description over 200 characters', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 1,
        description: 'a'.repeat(201),
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should accept description at exactly 200 characters', () => {
      const valid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 1,
        description: 'a'.repeat(200),
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('date validation', () => {
    it('should reject invalid date format', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 1,
        description: '',
        date: '15/01/2025',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject partial date', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 1,
        description: '',
        date: '2025-01',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should accept valid YYYY-MM-DD format', () => {
      const valid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 1,
        description: '',
        date: '2025-12-31',
      }

      const result = transactionSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('missing required fields', () => {
    it('should reject missing amount', () => {
      const invalid = {
        type: 'expense' as const,
        category_id: 1,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject missing type', () => {
      const invalid = {
        amount: 100,
        category_id: 1,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject missing category_id', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        description: '',
        date: '2025-01-15',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject missing date', () => {
      const invalid = {
        amount: 100,
        type: 'expense' as const,
        category_id: 1,
        description: '',
      }

      const result = transactionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })
})
