import { useState, useEffect } from 'react'
import { api, type Category } from '../lib/api'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    const result = await api.getCategories()
    if (result.success && result.data) {
      setCategories(result.data)
    } else {
      setError(result.error || 'Failed to fetch categories')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (data: Partial<Category>) => {
    const result = await api.createCategory(data)
    if (result.success) {
      await fetchCategories()
    }
    return result
  }

  const updateCategory = async (id: number, data: Partial<Category>) => {
    const result = await api.updateCategory(id, data)
    if (result.success) {
      await fetchCategories()
    }
    return result
  }

  const deleteCategory = async (id: number) => {
    const result = await api.deleteCategory(id)
    if (result.success) {
      await fetchCategories()
    }
    return result
  }

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
