import { ErrorCode } from '../enums/error'

export const ERROR_CODE_MESSAGE: Record<ErrorCode, string> = {
	[ErrorCode.UNKNOWN]: 'An unexpected error occurred.',
	[ErrorCode.INTERNAL_SERVER_ERROR]: 'The server encountered an error. Please try again later.',
	[ErrorCode.UNAUTHORIZED]: 'You are not authorized to perform this action.',
	[ErrorCode.NETWORK_ERROR]: 'Network error. Check your connection and try again.',
	[ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
}
