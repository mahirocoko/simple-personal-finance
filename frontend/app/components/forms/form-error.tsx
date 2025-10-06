import { cn } from '~/utils/cn'

interface IFormErrorProps {
	message?: string
	className?: string
}

/**
 * Reusable form error message component
 * Displays validation errors with consistent styling
 */
export function FormError({ message, className }: IFormErrorProps) {
	if (!message) {
		return null
	}

	return (
		<div className={cn('text-red-500 text-sm mt-1', className)} role="alert" aria-live="polite">
			{message}
		</div>
	)
}
