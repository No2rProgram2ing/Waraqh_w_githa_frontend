export interface AdminUser {
  id: number
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role?: unknown
  created_at: string
}

export interface AdminLoginResponse {
  success: boolean
  message: string
  data: {
    admin: AdminUser
    token: string
  }
}

export interface AdminLogoutResponse {
  success: boolean
  message: string
}