import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/macro'

import { ErrorCode } from '../enums/error'

export const ERROR_CODE_MESSAGE: Record<ErrorCode, MessageDescriptor> = {
  [ErrorCode.UNKNOWN]: msg`An unexpected error occurred.`,
  [ErrorCode.INTERNAL_SERVER_ERROR]: msg`The server encountered an error. Please try again later.`,
  [ErrorCode.UNAUTHORIZED]: msg`You are not authorized to perform this action.`,
  [ErrorCode.NETWORK_ERROR]: msg`Network error. Check your connection and try again.`,
  [ErrorCode.VALIDATION_ERROR]: msg`Please check your input and try again.`,
}
