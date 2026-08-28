import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rolesApi } from '../api/rolesApi'
import { permissionsApi } from '../api/permissionsApi'
import type { CreateRolePayload, UpdateRolePayload } from '../types/role'

export const roleKeys = {
    all: ['admin', 'roles'] as const,
    list: () => [...roleKeys.all, 'list'] as const,
    detail: (id: number) => [...roleKeys.all, 'detail', id] as const,
    permissions: ['admin', 'permissions', 'list'] as const,
}

export function useRoles() {
    return useQuery({
        queryKey: roleKeys.list(),
        queryFn: () => rolesApi.getAll(),
    })
}

export function useRole(id: number) {
    return useQuery({
        queryKey: roleKeys.detail(id),
        queryFn: () => rolesApi.getById(id),
        enabled: id > 0,
    })
}

export function useAllPermissions() {
    return useQuery({
        queryKey: roleKeys.permissions,
        queryFn: () => permissionsApi.getAll(),
    })
}

export function useCreateRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateRolePayload) => rolesApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: roleKeys.all })
        },
    })
}

export function useUpdateRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateRolePayload }) =>
            rolesApi.update(id, data),
        onSuccess: async (role) => {
            await queryClient.invalidateQueries({ queryKey: roleKeys.detail(role.id) })
            await queryClient.invalidateQueries({ queryKey: roleKeys.list() })
        },
    })
}

export function useDeleteRole() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => rolesApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: roleKeys.all })
        },
    })
}

export function useSyncRolePermissions() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            roleId,
            permissionIds,
        }: {
            roleId: number
            permissionIds: number[]
        }) => rolesApi.syncPermissions(roleId, { permission_ids: permissionIds }),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.roleId) })
            await queryClient.invalidateQueries({ queryKey: roleKeys.list() })
        },
    })
}
