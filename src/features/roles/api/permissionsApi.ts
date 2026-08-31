import { adminClient } from '@/lib/api/adminClient'
import type { RolePermission } from '../types/role'

export interface PermissionsListResponse {
    data: RolePermission[]
}

export const permissionsApi = {
    async getAll(): Promise<RolePermission[]> {
        const response = await adminClient.get<PermissionsListResponse>(
            '/admin/permissions' // Placeholder endpoint
        )
        return response.data.data
    },
}
