import type { ICategory, Category } from './models'

export interface ITransactionSummary {
  total_income: number
  total_expense: number
  balance: number
  transaction_count: number
}

export type TransactionSummary = ITransactionSummary

export interface ICategoryBreakdown extends Omit<ICategory, 'created_at'> {
  transaction_count: number
  total_amount: number
}

export type CategoryBreakdown = ICategoryBreakdown

export interface TransactionSummaryResponse {
  month: string
  summary: ITransactionSummary
  categoryBreakdown: ICategoryBreakdown[]
}
