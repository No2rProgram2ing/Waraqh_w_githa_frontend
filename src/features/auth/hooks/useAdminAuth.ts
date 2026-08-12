import { useMutation } from '@tanstack/react-query'
import { adminAuthApi } from '../api/adminAuthApi'
import { adminAuthStorage } from '../services/adminAuthStorage'
import type { AdminLoginCredentials } from '../api/adminAuthApi'

export function useAdminLogin() {
  return useMutation({
    mutationFn: (credentials: AdminLoginCredentials) =>
      adminAuthApi.login(credentials),

    onSuccess: (response) => {
      adminAuthStorage.setToken(response.data.token)
    },
  })
}

export function useAdminLogout() {
  return useMutation({
    mutationFn: () => adminAuthApi.logout(),

    onSettled: () => {
      adminAuthStorage.clearToken()
    },
  })
}