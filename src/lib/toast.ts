import { toast } from 'sonner'

export const showSuccessToast = (message: string): void => {
  toast.success(message)
}

export const showErrorToast = (message: string): void => {
  toast.error(message)
}

export const showValidationErrorToast = (errors: Record<string, string[]>): void => {
  const firstErrorMessage = Object.values(errors)
    .flatMap((fieldErrors) => fieldErrors ?? [])
    .find((message) => Boolean(message?.trim()))

  if (firstErrorMessage) {
    toast.error(firstErrorMessage)
    return
  }

  toast.error('حدث خطأ في التحقق من البيانات، يرجى مراجعة الحقول.')
}
