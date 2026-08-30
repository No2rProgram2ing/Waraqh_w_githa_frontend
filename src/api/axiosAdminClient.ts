import axios from 'axios'
import { adminAuthStorage } from '@/features/auth/services/adminAuthStorage'
import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'
import { sanitizeErrorMessage, showErrorToast } from '@/lib/toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const SAFE_SERVER_ERROR_MESSAGE =
  'حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.'

const NETWORK_ERROR_MESSAGE =
  'تعذر الاتصال بالخادم، يرجى المحاولة لاحقًا.'

export const axiosAdminClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

axiosAdminClient.interceptors.request.use((config) => {
  const token = adminAuthStorage.getToken()

  if (token) {
    // Ensure headers object exists and set Authorization as Bearer token
    config.headers = config.headers || {}
    ;(config.headers as any).Authorization = 'Bearer ' + token
  }

  if (config.data instanceof FormData) {
    // Axios headers can be a plain object or an AxiosHeaders instance.
    // Remove the Content-Type so the browser sets the correct multipart boundary.
    if (config.headers && typeof (config.headers as any).delete === 'function') {
      // AxiosHeaders (supported in newer axios versions)
      ;(config.headers as any).delete('Content-Type')
    } else if (config.headers) {
      // Plain object
      delete (config.headers as any)['Content-Type']
    }
  }

  return config
})

axiosAdminClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      adminAuthStorage.clearToken()
      useAdminAuthStore.getState().setAdmin(null)

      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }

      return Promise.reject(error)
    }

    if (!error.response) {
      showErrorToast(NETWORK_ERROR_MESSAGE)
      return Promise.reject(error)
    }

    const status = error.response.status
    const data = error.response.data

    if (status >= 500) {
      showErrorToast(SAFE_SERVER_ERROR_MESSAGE)
      return Promise.reject(error)
    }

    if (
      status >= 400 &&
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      const safeMessage = sanitizeErrorMessage(
        data.message,
        'تعذر تنفيذ العملية، يرجى التحقق من البيانات والمحاولة مرة أخرى.',
      )

      showErrorToast(safeMessage)
    }

    return Promise.reject(error)
  },
)
