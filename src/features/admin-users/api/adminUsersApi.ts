import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { AdminUser, CreateAdminUserPayload, UpdateAdminUserPayload } from '../types/admin-user'

export interface AdminUserListResponse {
    data: AdminUser[]
}

export interface AdminUserResponse {
    data: AdminUser
}

export const adminUsersApi = {
    async getAll(): Promise<AdminUser[]> {
        const response = await axiosAdminClient.get<AdminUserListResponse>(
            '/admin/admin-users' // Placeholder endpoint
        )
        return response.data.data
    },

    async create(data: CreateAdminUserPayload): Promise<AdminUser> {
        const response = await axiosAdminClient.post<AdminUserResponse>(
            '/admin/admin-users',
            data
        )
        return response.data.data
    },

    async update(id: number, data: UpdateAdminUserPayload): Promise<AdminUser> {
        const response = await axiosAdminClient.put<AdminUserResponse>(
            `/admin/admin-users/${id}`,
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(`/admin/admin-users/${id}`)
    }
}
