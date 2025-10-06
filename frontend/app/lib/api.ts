import { API_BASE_URL } from '../constants/api'
import type { ICategoryBreakdown, ITransactionSummary, TransactionSummaryResponse } from '../types/api'
import type { ICategory, IGoal, ITransaction } from '../types/models'

class ApiClient {
	private baseUrl: string

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	private async request<T>(
		endpoint: string,
		options?: RequestInit,
	): Promise<{ success: boolean; data?: T; error?: string }> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options?.headers,
				},
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Request failed')
			}

			return data
		} catch (error) {
			console.error('API Error:', error)
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}

	// Categories
	async getCategories() {
		return this.request<ICategory[]>('/categories')
	}

	async getCategory(id: number) {
		return this.request<ICategory>(`/categories/${id}`)
	}

	async createCategory(data: Partial<ICategory>) {
		return this.request<ICategory>('/categories', {
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	async updateCategory(id: number, data: Partial<ICategory>) {
		return this.request<ICategory>(`/categories/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		})
	}

	async deleteCategory(id: number) {
		return this.request(`/categories/${id}`, {
			method: 'DELETE',
		})
	}

	// Transactions
	async getTransactions(filters?: {
		month?: string
		type?: 'income' | 'expense'
		category_id?: number
	}) {
		const params = new URLSearchParams()
		if (filters?.month) params.append('month', filters.month)
		if (filters?.type) params.append('type', filters.type)
		if (filters?.category_id) params.append('category_id', filters.category_id.toString())

		const query = params.toString() ? `?${params.toString()}` : ''
		return this.request<ITransaction[]>(`/transactions${query}`)
	}

	async getTransactionSummary(month?: string) {
		const params = month ? `?month=${month}` : ''
		return this.request<TransactionSummaryResponse>(`/transactions/summary${params}`)
	}

	async getTransaction(id: number) {
		return this.request<ITransaction>(`/transactions/${id}`)
	}

	async createTransaction(data: Partial<ITransaction>) {
		return this.request<ITransaction>('/transactions', {
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	async updateTransaction(id: number, data: Partial<ITransaction>) {
		return this.request<ITransaction>(`/transactions/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		})
	}

	async deleteTransaction(id: number) {
		return this.request(`/transactions/${id}`, {
			method: 'DELETE',
		})
	}

	// Goals
	async getGoals() {
		return this.request<IGoal[]>('/goals')
	}

	async getGoal(id: number) {
		return this.request<IGoal>(`/goals/${id}`)
	}

	async getGoalProgress(id: number) {
		return this.request<IGoal & { daysRemaining: number | null; isOverdue: boolean; isCompleted: boolean }>(
			`/goals/${id}/progress`,
		)
	}

	async createGoal(data: Partial<IGoal>) {
		return this.request<IGoal>('/goals', {
			method: 'POST',
			body: JSON.stringify(data),
		})
	}

	async updateGoal(id: number, data: Partial<IGoal>) {
		return this.request<IGoal>(`/goals/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		})
	}

	async deleteGoal(id: number) {
		return this.request(`/goals/${id}`, {
			method: 'DELETE',
		})
	}
}

export const api = new ApiClient(API_BASE_URL)

export type { ICategory, ITransaction, IGoal } from '../types/models'
export type { ITransactionSummary, ICategoryBreakdown, TransactionSummaryResponse } from '../types/api'
