import { useEffect, useState } from 'react'
import type { ErrorCode } from '../enums/error'
import { api } from '../lib/api'
import type { ICategory } from '../types/models'
import { useFetchError } from './use-fetch-error'

export function useCategories() {
	const [categories, setCategories] = useState<ICategory[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<ErrorCode | null>(null)
	const { showErrorMessage } = useFetchError()

	const fetchCategories = async () => {
		setLoading(true)
		setError(null)
		const result = await api.getCategories()
		if (result.success && result.data) {
			setCategories(result.data)
		} else {
			const { code } = showErrorMessage(result.error, 'Failed to fetch categories')
			setError(code)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchCategories()
	}, [])

	const createCategory = async (data: Partial<ICategory>) => {
		const result = await api.createCategory(data)
		if (result.success) {
			await fetchCategories()
		}
		return result
	}

	const updateCategory = async (id: number, data: Partial<ICategory>) => {
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
