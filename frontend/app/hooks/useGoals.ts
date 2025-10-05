import { useState, useEffect } from 'react'
import { api, type Goal } from '../lib/api'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = async () => {
    setLoading(true)
    setError(null)
    const result = await api.getGoals()
    if (result.success && result.data) {
      setGoals(result.data)
    } else {
      setError(result.error || 'Failed to fetch goals')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const createGoal = async (data: Partial<Goal>) => {
    const result = await api.createGoal(data)
    if (result.success) {
      await fetchGoals()
    }
    return result
  }

  const updateGoal = async (id: number, data: Partial<Goal>) => {
    const result = await api.updateGoal(id, data)
    if (result.success) {
      await fetchGoals()
    }
    return result
  }

  const deleteGoal = async (id: number) => {
    const result = await api.deleteGoal(id)
    if (result.success) {
      await fetchGoals()
    }
    return result
  }

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  }
}
