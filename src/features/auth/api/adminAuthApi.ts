import { axiosAdminClient } from '@/api/axiosAdminClient'
import type {
  AdminLoginResponse,
  AdminLogoutResponse,
  AdminUser,
} from '../types/admin'

export interface AdminLoginCredentials {
  email: string
  password: string
}
export interface AdminProfileResponse {
  data: AdminUser
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

  async getProfile(): Promise<AdminProfileResponse> {
    const response =
      await axiosAdminClient.get<AdminProfileResponse>(
        '/admin/profile',
      )

    return response.data
  },
}