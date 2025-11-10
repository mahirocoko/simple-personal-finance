import { AlertCircle } from 'lucide-react'

export interface IErrorMessageProps {
	message: string
	className?: string
}

export function ErrorMessage({ message, className }: IErrorMessageProps) {
	return (
		<div
			className={`flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md ${className}`}
			role="alert"
		>
			<AlertCircle className="h-4 w-4 flex-shrink-0" />
			<span className="text-sm font-medium">{message}</span>
		</div>
	)
}
