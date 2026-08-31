import { adminClient } from '@/lib/api/adminClient'
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
    const response = await adminClient.post<AdminLoginResponse>(
      '/admin/auth/login',
      credentials,
    )

    return response.data
  },

  async logout(): Promise<AdminLogoutResponse> {
    const response =
      await adminClient.post<AdminLogoutResponse>(
        '/admin/auth/logout',
      )

    return response.data
  },

  async getProfile(): Promise<AdminProfileResponse> {
    const response =
      await adminClient.get<AdminProfileResponse>(
        '/admin/profile',
      )

    return response.data
  },
}