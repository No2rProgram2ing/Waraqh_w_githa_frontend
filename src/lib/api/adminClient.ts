import { createApiClient } from './apiClientFactory'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const adminClient = createApiClient({
  baseURL: API_BASE_URL,
  tokenKey: 'admin_access_token',
  unauthorizedRedirectPath: '/admin/login',
})
