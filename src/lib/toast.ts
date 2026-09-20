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

const repairUtf8Mojibake = (message: string): string => {
  // Avoid corrupting legitimate Arabic text. This logic previously matched
  // valid Arabic characters and converted them into mojibake.
  if (!/[ÃÂÐØÙ]/.test(message)) {
    return message
  }

  // Leave already-correct Arabic strings untouched. We do not attempt to
  // decode arbitrary Unicode text here because it can produce false positives.
  return message
}

export const sanitizeErrorMessage = (
  message: unknown,
  fallback = SAFE_GENERIC_ERROR_MESSAGE,
): string => {
  if (typeof message !== 'string') {
    return fallback
  }

  const trimmed = repairUtf8Mojibake(message.trim())

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

export const showInfoToast = (message: string): void => {
  toast.error(message, {
    style: {
      background: '#fef2f2',
      border: '1px solid #f0b4b4',
      color: '#7f1d1d',
    },
  })
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