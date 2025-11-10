import { cn } from '~/lib/utils'

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
		<div className={cn('text-destructive text-sm font-medium', className)} role="alert" aria-live="polite">
			{message}
		</div>
	)
}
