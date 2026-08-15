import { toast } from 'sonner'

const TECHNICAL_ERROR_PATTERNS = [
  'SQLSTATE',
  'SQL:',
  'Connection:',
  'Host:',
  'Port:',
  'Database:',
  'QueryException',
  'PDOException',
  'PostgreSQL',
  'pgsql',
  'stack trace',
  'Stack trace',
]

const SAFE_GENERIC_ERROR_MESSAGE =
  'حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.'

const containsTechnicalDetails = (message: string): boolean => {
  const normalized = message.toLowerCase()

  return TECHNICAL_ERROR_PATTERNS.some((pattern) =>
    normalized.includes(pattern.toLowerCase()),
  )
}

export const sanitizeErrorMessage = (
  message: unknown,
  fallback = SAFE_GENERIC_ERROR_MESSAGE,
): string => {
  if (typeof message !== 'string') {
    return fallback
  }

  const trimmed = message.trim()

  if (!trimmed) {
    return fallback
  }

  if (containsTechnicalDetails(trimmed)) {
    return fallback
  }

  return trimmed
}

export const showSuccessToast = (message: string): void => {
  toast.success(message)
}

export const showErrorToast = (message: string): void => {
  toast.error(sanitizeErrorMessage(message))
}

export const showValidationErrorToast = (
  errors: Record<string, string[]>,
): void => {
  const firstErrorMessage = Object.values(errors)
    .flatMap((fieldErrors) => fieldErrors ?? [])
    .find((message) => Boolean(message?.trim()))

  if (firstErrorMessage) {
    toast.error(
      sanitizeErrorMessage(
        firstErrorMessage,
        'حدث خطأ في التحقق من البيانات، يرجى مراجعة الحقول.',
      ),
    )
    return
  }

  toast.error('حدث خطأ في التحقق من البيانات، يرجى مراجعة الحقول.')
}