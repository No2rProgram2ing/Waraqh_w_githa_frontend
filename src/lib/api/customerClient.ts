import { createApiClient } from './apiClientFactory'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const customerClient = createApiClient({
  baseURL: API_BASE_URL,
  tokenKey: 'customer_token',
  unauthorizedRedirectPath: '/login',
})
