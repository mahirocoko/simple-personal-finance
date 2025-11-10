import { useLingui } from '@lingui/react/macro'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cn } from '~/lib/utils'

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
        <div className={cn('flex flex-col gap-2', className)}>
          <Label htmlFor={name} className={cn(fieldState.error && 'text-destructive')}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>

          <Select
            value={field.value ? String(field.value) : ''}
            onValueChange={(value) => {
              // Convert to number if the option value is a number
              const option = options.find((opt) => String(opt.value) === value)
              if (option && typeof option.value === 'number') {
                field.onChange(Number(value))
              } else {
                field.onChange(value === '' ? undefined : value)
              }
            }}
          >
            <SelectTrigger
              id={name}
              className={cn(fieldState.error && 'border-destructive focus:ring-destructive')}
              aria-invalid={fieldState.error ? 'true' : 'false'}
              aria-describedby={fieldState.error ? `${name}-error` : undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
