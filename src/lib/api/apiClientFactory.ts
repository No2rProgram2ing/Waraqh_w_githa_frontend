import axios, { type AxiosInstance } from 'axios'
import { sanitizeErrorMessage, showErrorToast } from '@/lib/toast'

interface ApiClientConfig {
  baseURL: string
  tokenKey: string
  unauthorizedRedirectPath: string
}

const SAFE_SERVER_ERROR_MESSAGE = 'حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.'
const NETWORK_ERROR_MESSAGE = 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقًا.'

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use((reqConfig) => {
    const token = localStorage.getItem(config.tokenKey)

    if (token) {
      reqConfig.headers = reqConfig.headers || {}
      ;(reqConfig.headers as any).Authorization = 'Bearer ' + token
    }

    if (reqConfig.data instanceof FormData) {
      if (reqConfig.headers && typeof (reqConfig.headers as any).delete === 'function') {
        ;(reqConfig.headers as any).delete('Content-Type')
      } else if (reqConfig.headers) {
        delete (reqConfig.headers as any)['Content-Type']
      }
    }

    return reqConfig
  })

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error)
      }

      if (error.response?.status === 401) {
        localStorage.removeItem(config.tokenKey)
        
        if (window.location.pathname !== config.unauthorizedRedirectPath) {
          window.location.href = config.unauthorizedRedirectPath
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
          'تعذر تنفيذ العملية، يرجى التحقق من البيانات والمحاولة مرة أخرى.'
        )

        showErrorToast(safeMessage)
      }

      return Promise.reject(error)
    }
  )

  return client
}
