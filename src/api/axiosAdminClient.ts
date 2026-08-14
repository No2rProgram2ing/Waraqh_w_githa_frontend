import axios from 'axios'
import { adminAuthStorage } from '@/features/auth/services/adminAuthStorage'
import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'
import { sanitizeErrorMessage, showErrorToast } from '@/lib/toast'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

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
    config.headers.Authorization = `Bearer ${token}`
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