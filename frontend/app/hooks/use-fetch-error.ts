import { useLingui } from '@lingui/react'
import { useCallback } from 'react'

import { ERROR_CODE_MESSAGE } from '../constants/error'
import { ErrorCode } from '../enums/error'

const KNOWN_ERROR_CODES = new Set<string>(Object.values(ErrorCode))

const mapStatusToCode = (status?: number): ErrorCode => {
  if (status == null) return ErrorCode.UNKNOWN
  if (status >= 500) return ErrorCode.INTERNAL_SERVER_ERROR
  if (status === 401 || status === 403) return ErrorCode.UNAUTHORIZED
  if (status === 422 || status === 400) return ErrorCode.VALIDATION_ERROR
  return ErrorCode.UNKNOWN
}

const mapMessageToCode = (message: string): ErrorCode => {
  const normalized = message.toLowerCase()
  if (normalized.includes('network') || normalized.includes('fetch')) {
    return ErrorCode.NETWORK_ERROR
  }
  if (normalized.includes('unauthorized') || normalized.includes('forbidden')) {
    return ErrorCode.UNAUTHORIZED
  }
  if (normalized.includes('validation') || normalized.includes('invalid')) {
    return ErrorCode.VALIDATION_ERROR
  }
  if (normalized.includes('internal') || normalized.includes('server')) {
    return ErrorCode.INTERNAL_SERVER_ERROR
  }
  return ErrorCode.UNKNOWN
}

const parseErrorCode = (error: unknown): ErrorCode => {
  if (error == null) {
    return ErrorCode.UNKNOWN
  }

  if (typeof error === 'string') {
    const normalized = error.toUpperCase()
    if (KNOWN_ERROR_CODES.has(normalized)) {
      return normalized as ErrorCode
    }
    return mapMessageToCode(error)
  }

  if (error instanceof Error) {
    return parseErrorCode(error.message)
  }

  if (typeof error === 'number') {
    return mapStatusToCode(error)
  }

  if (typeof error === 'object') {
    const errorObject = error as Record<string, unknown>

    if (typeof errorObject.code === 'string') {
      const code = errorObject.code.toUpperCase()
      if (KNOWN_ERROR_CODES.has(code)) {
        return code as ErrorCode
      }
      return mapMessageToCode(errorObject.code)
    }

    if (typeof errorObject.status === 'number') {
      return mapStatusToCode(errorObject.status)
    }

    if (typeof errorObject.message === 'string') {
      return mapMessageToCode(errorObject.message)
    }
  }

  return ErrorCode.UNKNOWN
}

export function useFetchError() {
  const { _ } = useLingui()

  const getErrorCode = useCallback((error: unknown) => parseErrorCode(error), [])

  const getErrorMessage = useCallback(
    (code: ErrorCode, fallback?: string) => {
      const messageKey = ERROR_CODE_MESSAGE[code] || ERROR_CODE_MESSAGE[ErrorCode.UNKNOWN]
      const baseMessage = _(messageKey)
      if (!fallback) {
        return baseMessage
      }
      return `${baseMessage} (${fallback})`
    },
    [_],
  )

  const showErrorMessage = useCallback(
    (error: unknown, fallback?: string) => {
      const code = getErrorCode(error)
      const details =
        fallback || (typeof error === 'string' && !KNOWN_ERROR_CODES.has(error.toUpperCase()) ? error : undefined)
      const message = getErrorMessage(code, details)
      console.error(message)
      return { code, message }
    },
    [getErrorCode, getErrorMessage],
  )

  return {
    getErrorCode,
    getErrorMessage,
    showErrorMessage,
  }
}
