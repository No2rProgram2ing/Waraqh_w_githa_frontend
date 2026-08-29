import { axiosAdminClient } from '@/api/axiosAdminClient'
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
        const response = await axiosAdminClient.get<RoleListResponse>(
            '/admin/roles' // Placeholder endpoint
        )
        return response.data.data
    },

    async getById(id: number): Promise<RoleWithPermissions> {
        const response = await axiosAdminClient.get<RoleResponse>(
            `/admin/roles/${id}` // Placeholder endpoint
        )
        return response.data.data
    },

    async create(data: CreateRolePayload): Promise<Role> {
        const response = await axiosAdminClient.post<{ data: Role }>(
            '/admin/roles', // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async update(id: number, data: UpdateRolePayload): Promise<Role> {
        const response = await axiosAdminClient.put<{ data: Role }>(
            `/admin/roles/${id}`, // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(
            `/admin/roles/${id}` // Placeholder endpoint
        )
    },

    async syncPermissions(roleId: number, payload: SyncPermissionsPayload): Promise<void> {
        await axiosAdminClient.put(
            `/admin/roles/${roleId}/permissions`, // Placeholder endpoint
            payload
        )
    },
}
