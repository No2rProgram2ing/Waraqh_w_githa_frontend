export type AdminUserStatus = 'active' | 'inactive'

export interface AdminUser {
    id: number
    first_name: string
    last_name: string
    email: string
    role_name: string // e.g. "مدير عام", "مشرف طلبات"
    status: AdminUserStatus
    created_at: string
}

export interface CreateAdminUserPayload {
    first_name: string
    last_name: string
    email: string
    role_id: number
    password?: string // optional if using an invite link system, but let's include it
}

export interface UpdateAdminUserPayload {
    first_name?: string
    last_name?: string
    email?: string
    role_id?: number
    status?: AdminUserStatus
    password?: string // if they want to reset it
}
