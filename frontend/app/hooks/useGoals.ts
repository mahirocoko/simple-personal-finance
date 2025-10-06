import { useEffect, useState } from 'react'
import type { ErrorCode } from '../enums/error'
import { api } from '../lib/api'
import type { IGoal } from '../types/models'
import { useFetchError } from './use-fetch-error'

export function useGoals() {
	const [goals, setGoals] = useState<IGoal[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<ErrorCode | null>(null)
	const { showErrorMessage } = useFetchError()

	const fetchGoals = async () => {
		setLoading(true)
		setError(null)
		const result = await api.getGoals()
		if (result.success && result.data) {
			setGoals(result.data)
		} else {
			const { code } = showErrorMessage(result.error, 'Failed to fetch goals')
			setError(code)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchGoals()
	}, [])

	const createGoal = async (data: Partial<IGoal>) => {
		const result = await api.createGoal(data)
		if (result.success) {
			await fetchGoals()
		}
		return result
	}

	const updateGoal = async (id: number, data: Partial<IGoal>) => {
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
