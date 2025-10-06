import { useLingui } from '@lingui/react/macro'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { cn } from '~/utils/cn'

interface ISelectOption {
	value: string | number
	label: string
}

interface IFormSelectProps<TFieldValues extends FieldValues> {
	name: FieldPath<TFieldValues>
	control: Control<TFieldValues>
	label: string
	options: ISelectOption[]
	placeholder?: string
	required?: boolean
	className?: string
}

export function FormSelect<TFieldValues extends FieldValues>({
	name,
	control,
	label,
	options,
	placeholder = 'Select an option',
	required = false,
	className,
}: IFormSelectProps<TFieldValues>) {
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

					<select
						{...field}
						id={name}
						value={field.value ?? ''}
						onChange={(e) => {
							// Convert to number if the option value is a number
							const option = options.find((opt) => String(opt.value) === e.target.value)
							if (option && typeof option.value === 'number') {
								field.onChange(Number(e.target.value))
							} else {
								field.onChange(e.target.value)
							}
						}}
						className={cn(
							'px-3 py-2 border rounded-md bg-white',
							'focus:outline-none focus:ring-2 focus:ring-blue-500',
							fieldState.error && 'border-red-500',
						)}
						aria-invalid={fieldState.error ? 'true' : 'false'}
						aria-describedby={fieldState.error ? `${name}-error` : undefined}
					>
						<option value="" disabled>
							{placeholder}
						</option>
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

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
