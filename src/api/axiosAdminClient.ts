import axios from 'axios'
import { adminAuthStorage } from '@/features/auth/services/adminAuthStorage'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

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
  (error) => {
    if (error.response?.status === 401) {
      adminAuthStorage.clearToken()
    }

    return Promise.reject(error)
  },
)
