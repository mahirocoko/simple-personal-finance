import { useLingui } from '@lingui/react/macro'
import type { HTMLInputTypeAttribute } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

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
				<div className={cn('flex flex-col gap-2', className)}>
					<Label htmlFor={name} className={cn(fieldState.error && 'text-destructive')}>
						{label}
						{required && <span className="text-destructive ml-1">*</span>}
					</Label>

					<Input
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
						aria-invalid={fieldState.error ? 'true' : 'false'}
						aria-describedby={fieldState.error ? `${name}-error` : undefined}
						className={cn(fieldState.error && 'border-destructive focus:ring-destructive')}
					/>

					{fieldState.error && (
						<span id={`${name}-error`} className="text-destructive text-sm" role="alert">
							{fieldState.error.message}
						</span>
					)}
				</div>
			)}
		/>
	)
}
