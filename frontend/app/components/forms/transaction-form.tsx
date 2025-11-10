import { zodResolver } from '@hookform/resolvers/zod'
import { useLingui } from '@lingui/react/macro'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TransactionFormData } from '~/schemas'
import { transactionSchema } from '~/schemas'
import type { Category } from '~/types/models'
import { FormInput, FormSelect } from './'

interface ITransactionFormProps {
  categories: Category[]
  onSubmit: (data: TransactionFormData) => Promise<{ success: boolean }>
  onCancel: () => void
}

export function TransactionForm({ categories, onSubmit, onCancel }: ITransactionFormProps) {
  const { t } = useLingui()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: undefined,
      type: 'expense',
      category_id: undefined,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const selectedType = watch('type')
  const availableCategories = categories.filter((cat) => cat.type === selectedType)

  const onFormSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await onSubmit(data)

      if (result.success) {
        reset()
        onCancel() // Close form on success
      } else {
        setSubmitError(t`Failed to create transaction. Please try again.`)
      }
    } catch (error) {
      setSubmitError(t`An error occurred while creating the transaction. Please try again.`)
      console.error('Transaction creation error:', error)
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
        {/* Type */}
        <FormSelect
          name="type"
          control={control}
          label={t`Type`}
          options={[
            { value: 'expense', label: t`Expense` },
            { value: 'income', label: t`Income` },
          ]}
          required
        />

        {/* Amount */}
        <FormInput
          name="amount"
          control={control}
          label={t`Amount`}
          type="number"
          step="0.01"
          placeholder="0.00"
          required
        />

        {/* Category */}
        <FormSelect
          name="category_id"
          control={control}
          label={t`Category`}
          options={availableCategories.map((cat) => ({
            value: cat.id,
            label: `${cat.icon} ${cat.name}`,
          }))}
          placeholder={t`Select Category`}
          required
        />

        {/* Date */}
        <FormInput name="date" control={control} label={t`Date`} type="date" required />
      </div>

      {/* Description */}
      <FormInput name="description" control={control} label={t`Note`} placeholder={t`Optional description`} />

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t`Saving...` : t`Save`}
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
