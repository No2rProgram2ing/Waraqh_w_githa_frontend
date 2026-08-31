import { adminClient } from '@/lib/api/adminClient'
import type {
    Role,
    RoleWithPermissions,
    CreateRolePayload,
    UpdateRolePayload,
    SyncPermissionsPayload,
} from '../types/role'

export interface RoleListResponse {
    data: Role[]
}

export interface RoleResponse {
    data: RoleWithPermissions
}

export const rolesApi = {
    async getAll(): Promise<Role[]> {
        const response = await adminClient.get<RoleListResponse>(
            '/admin/roles' // Placeholder endpoint
        )
        return response.data.data
    },

    async getById(id: number): Promise<RoleWithPermissions> {
        const response = await adminClient.get<RoleResponse>(
            `/admin/roles/${id}` // Placeholder endpoint
        )
        return response.data.data
    },

    async create(data: CreateRolePayload): Promise<Role> {
        const response = await adminClient.post<{ data: Role }>(
            '/admin/roles', // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async update(id: number, data: UpdateRolePayload): Promise<Role> {
        const response = await adminClient.put<{ data: Role }>(
            `/admin/roles/${id}`, // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await adminClient.delete(
            `/admin/roles/${id}` // Placeholder endpoint
        )
    },

    async syncPermissions(roleId: number, payload: SyncPermissionsPayload): Promise<void> {
        await adminClient.put(
            `/admin/roles/${roleId}/permissions`, // Placeholder endpoint
            payload
        )
    },
}
