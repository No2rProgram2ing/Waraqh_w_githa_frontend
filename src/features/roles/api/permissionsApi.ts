import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { RolePermission } from '../types/role'

export interface PermissionsListResponse {
    data: RolePermission[]
}

export const permissionsApi = {
    async getAll(): Promise<RolePermission[]> {
        const response = await axiosAdminClient.get<PermissionsListResponse>(
            '/admin/permissions' // Placeholder endpoint
        )
        return response.data.data
    },
}
