import { axiosAdminClient } from '@/api/axiosAdminClient'
import type {
  AdminLoginResponse,
  AdminLogoutResponse,
} from '../types/admin'

export interface AdminLoginCredentials {
  email: string
  password: string
}

export const adminAuthApi = {
  async login(
    credentials: AdminLoginCredentials,
  ): Promise<AdminLoginResponse> {
    const response = await axiosAdminClient.post<AdminLoginResponse>(
      '/admin/auth/login',
      credentials,
    )

    return response.data
  },

  async logout(): Promise<AdminLogoutResponse> {
    const response =
      await axiosAdminClient.post<AdminLogoutResponse>(
        '/admin/auth/logout',
      )

    return response.data
  },
}