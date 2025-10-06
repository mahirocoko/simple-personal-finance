import { zodResolver } from '@hookform/resolvers/zod'
import { useLingui } from '@lingui/react/macro'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { GoalFormData } from '~/schemas'
import { goalSchema } from '~/schemas'
import { FormInput } from './'

interface IGoalFormProps {
	onSubmit: (data: GoalFormData) => Promise<{ success: boolean }>
	onCancel: () => void
}

export function GoalForm({ onSubmit, onCancel }: IGoalFormProps) {
	const { t } = useLingui()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<GoalFormData>({
		resolver: zodResolver(goalSchema),
		defaultValues: {
			name: '',
			target_amount: 0,
			current_amount: 0,
			deadline: '',
		},
		mode: 'onBlur',
	})

	// Watch values for progress indicator
	const targetAmount = watch('target_amount')
	const currentAmount = watch('current_amount')

	// Calculate progress percentage
	const progress = targetAmount && targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0

	const onFormSubmit = async (data: GoalFormData) => {
		setIsSubmitting(true)
		setSubmitError(null)

		try {
			const result = await onSubmit(data)

			if (result.success) {
				reset()
				onCancel() // Close form on success
			} else {
				setSubmitError(t`Failed to create goal. Please try again.`)
			}
		} catch (error) {
			setSubmitError(t`An error occurred while creating the goal. Please try again.`)
			console.error('Goal creation error:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="bg-gray-100 p-6 rounded-lg mb-6 space-y-4">
			{submitError && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
					{submitError}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Goal Name */}
				<FormInput<GoalFormData>
					name="name"
					control={control}
					label={t`Goal Name`}
					type="text"
					placeholder={t`e.g. Buy a new car`}
					required
					className="md:col-span-2"
				/>

				{/* Target Amount */}
				<FormInput<GoalFormData>
					name="target_amount"
					control={control}
					label={t`Target Amount (฿)`}
					type="number"
					step="0.01"
					placeholder="0.00"
					required
				/>

				{/* Current Amount */}
				<FormInput<GoalFormData>
					name="current_amount"
					control={control}
					label={t`Saved Amount (฿)`}
					type="number"
					step="0.01"
					placeholder="0"
				/>

				{/* Deadline */}
				<FormInput<GoalFormData>
					name="deadline"
					control={control}
					label={t`Deadline (Optional)`}
					type="date"
					className="md:col-span-2"
				/>
			</div>

			{/* Progress Indicator */}
			{targetAmount && targetAmount > 0 && (
				<div className="pt-2">
					<div className="flex justify-between text-sm mb-2">
						<span className="font-medium">{t`Progress Preview`}</span>
						<span className="font-semibold">{progress.toFixed(1)}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-4">
						<div
							className={`h-4 rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
							style={{ width: `${Math.min(progress, 100)}%` }}
						/>
					</div>
					<div className="flex justify-between text-sm mt-1 text-gray-600">
						<span>฿{currentAmount.toLocaleString()}</span>
						<span>฿{targetAmount.toLocaleString()}</span>
					</div>
				</div>
			)}

			{/* Buttons */}
			<div className="flex gap-3 pt-2">
				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isSubmitting ? t`Creating...` : t`Create Goal`}
				</button>

				<button
					type="button"
					onClick={() => {
						reset()
						onCancel()
					}}
					disabled={isSubmitting}
					className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{t`Cancel`}
				</button>
			</div>
		</form>
	)
}
