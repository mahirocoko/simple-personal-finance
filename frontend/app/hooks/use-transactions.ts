import { useEffect, useState } from 'react'
import type { ErrorCode } from '../enums/error'
import { api } from '../lib/api'
import type { TransactionSummaryResponse } from '../types/api'
import type { ITransaction } from '../types/models'
import { useFetchError } from './use-fetch-error'

interface UseTransactionsOptions {
  month?: string
  type?: 'income' | 'expense'
  category_id?: number
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorCode | null>(null)
  const { showErrorMessage } = useFetchError()

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    const result = await api.getTransactions(options)
    if (result.success && result.data) {
      setTransactions(result.data)
    } else {
      const { code } = showErrorMessage(result.error, 'Failed to fetch transactions')
      setError(code)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [options.month, options.type, options.category_id])

  const createTransaction = async (data: Partial<ITransaction>) => {
    const result = await api.createTransaction(data)
    if (result.success) {
      await fetchTransactions()
    }
    return result
  }

  const updateTransaction = async (id: number, data: Partial<ITransaction>) => {
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
  const [summary, setSummary] = useState<TransactionSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorCode | null>(null)
  const { showErrorMessage } = useFetchError()

  const fetchSummary = async () => {
    setLoading(true)
    setError(null)
    const result = await api.getTransactionSummary(month)
    if (result.success && result.data) {
      setSummary(result.data)
    } else {
      const { code } = showErrorMessage(result.error, 'Failed to fetch summary')
      setError(code)
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
