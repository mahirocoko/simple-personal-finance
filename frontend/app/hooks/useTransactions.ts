import { useState, useEffect } from 'react'
import { api, type Transaction } from '../lib/api'

interface UseTransactionsOptions {
  month?: string
  type?: 'income' | 'expense'
  category_id?: number
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    const result = await api.getTransactions(options)
    if (result.success && result.data) {
      setTransactions(result.data)
    } else {
      setError(result.error || 'Failed to fetch transactions')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [options.month, options.type, options.category_id])

  const createTransaction = async (data: Partial<Transaction>) => {
    const result = await api.createTransaction(data)
    if (result.success) {
      await fetchTransactions()
    }
    return result
  }

  const updateTransaction = async (id: number, data: Partial<Transaction>) => {
    const result = await api.updateTransaction(id, data)
    if (result.success) {
      await fetchTransactions()
    }
    return result
  }

  const deleteTransaction = async (id: number) => {
    const result = await api.deleteTransaction(id)
    if (result.success) {
      await fetchTransactions()
    }
    return result
  }

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}

export function useTransactionSummary(month?: string) {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = async () => {
    setLoading(true)
    setError(null)
    const result = await api.getTransactionSummary(month)
    if (result.success && result.data) {
      setSummary(result.data)
    } else {
      setError(result.error || 'Failed to fetch summary')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSummary()
  }, [month])

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  }
}
