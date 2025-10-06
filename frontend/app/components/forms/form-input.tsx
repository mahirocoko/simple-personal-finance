import { useLingui } from '@lingui/react/macro'
import type { HTMLInputTypeAttribute } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { cn } from '~/utils/cn'

interface IFormInputProps<TFieldValues extends FieldValues> {
	name: FieldPath<TFieldValues>
	control: Control<TFieldValues>
	label: string
	type?: HTMLInputTypeAttribute
	placeholder?: string
	required?: boolean
	className?: string
	step?: string | number
}

export function FormInput<TFieldValues extends FieldValues>({
	name,
	control,
	label,
	type = 'text',
	placeholder,
	required = false,
	className,
	step,
}: IFormInputProps<TFieldValues>) {
	const { t } = useLingui()

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<div className={cn('flex flex-col gap-1', className)}>
					<label htmlFor={name} className="font-medium text-sm">
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>

					<input
						{...field}
						id={name}
						type={type}
						placeholder={placeholder}
						step={step}
						value={field.value ?? ''}
						onChange={(e) => {
							// Handle number inputs
							if (type === 'number') {
								const value = e.target.value
								field.onChange(value === '' ? undefined : Number(value))
							} else {
								field.onChange(e)
							}
						}}
						className={cn(
							'px-3 py-2 border rounded-md',
							'focus:outline-none focus:ring-2 focus:ring-blue-500',
							fieldState.error && 'border-red-500',
						)}
						aria-invalid={fieldState.error ? 'true' : 'false'}
						aria-describedby={fieldState.error ? `${name}-error` : undefined}
					/>

					{fieldState.error && (
						<span id={`${name}-error`} className="text-red-500 text-sm" role="alert">
							{fieldState.error.message}
						</span>
					)}
				</div>
			)}
		/>
	)
}
