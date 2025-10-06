export interface ICategory {
  id: number
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  created_at: string
}

export type Category = ICategory

export interface ITransaction {
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

export type Transaction = ITransaction

export interface IGoal {
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

export type Goal = IGoal
