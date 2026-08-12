import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUsersApi } from '../api/adminUsersApi'
import type { CreateAdminUserPayload, UpdateAdminUserPayload } from '../types/admin-user'

export const adminUserKeys = {
    all: ['admin', 'admin-users'] as const,
    list: () => [...adminUserKeys.all, 'list'] as const,
}

export function useAdminUsers() {
    return useQuery({
        queryKey: adminUserKeys.list(),
        queryFn: () => adminUsersApi.getAll(),
    })
}

export function useCreateAdminUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateAdminUserPayload) => adminUsersApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: adminUserKeys.all })
        },
    })
}

export function useUpdateAdminUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateAdminUserPayload }) =>
            adminUsersApi.update(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: adminUserKeys.all })
        },
    })
}

export function useDeleteAdminUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => adminUsersApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: adminUserKeys.all })
        },
    })
}
