const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  created_at: string
}

export interface Transaction {
  id: number
  amount: number
  type: 'income' | 'expense'
  category_id: number
  category_name?: string
  category_color?: string
  category_icon?: string
  description?: string
  date: string
  created_at: string
  updated_at: string
}

export interface Goal {
  id: number
  name: string
  target_amount: number
  current_amount: number
  progress_percentage?: number
  remaining_amount?: number
  deadline?: string
  created_at: string
  updated_at: string
}

export interface TransactionSummary {
  total_income: number
  total_expense: number
  balance: number
  transaction_count: number
}

export interface CategoryBreakdown {
  id: number
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  transaction_count: number
  total_amount: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
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
    return this.request<Category[]>('/categories')
  }

  async getCategory(id: number) {
    return this.request<Category>(`/categories/${id}`)
  }

  async createCategory(data: Partial<Category>) {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: number, data: Partial<Category>) {
    return this.request<Category>(`/categories/${id}`, {
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
    if (filters?.category_id)
      params.append('category_id', filters.category_id.toString())

    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<Transaction[]>(`/transactions${query}`)
  }

  async getTransactionSummary(month?: string) {
    const params = month ? `?month=${month}` : ''
    return this.request<{
      month: string
      summary: TransactionSummary
      categoryBreakdown: CategoryBreakdown[]
    }>(`/transactions/summary${params}`)
  }

  async getTransaction(id: number) {
    return this.request<Transaction>(`/transactions/${id}`)
  }

  async createTransaction(data: Partial<Transaction>) {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTransaction(id: number, data: Partial<Transaction>) {
    return this.request<Transaction>(`/transactions/${id}`, {
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
    return this.request<Goal[]>('/goals')
  }

  async getGoal(id: number) {
    return this.request<Goal>(`/goals/${id}`)
  }

  async getGoalProgress(id: number) {
    return this.request<Goal & { daysRemaining: number | null; isOverdue: boolean; isCompleted: boolean }>(`/goals/${id}/progress`)
  }

  async createGoal(data: Partial<Goal>) {
    return this.request<Goal>('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateGoal(id: number, data: Partial<Goal>) {
    return this.request<Goal>(`/goals/${id}`, {
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
