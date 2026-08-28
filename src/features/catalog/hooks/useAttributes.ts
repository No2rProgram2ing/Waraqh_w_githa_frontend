import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { attributesApi } from '../api/attributesApi'
import type { CreateAttributePayload, UpdateAttributePayload } from '../types/product-attribute'

export const attributeKeys = {
    all: ['admin', 'product-attributes'] as const,
    list: () => [...attributeKeys.all, 'list'] as const,
    detail: (id: number) => [...attributeKeys.all, 'detail', id] as const,
}

export function useAttributes() {
    return useQuery({
        queryKey: attributeKeys.list(),
        queryFn: () => attributesApi.getAll(),
    })
}

export function useAttribute(id: number) {
    return useQuery({
        queryKey: attributeKeys.detail(id),
        queryFn: () => attributesApi.getById(id),
        enabled: id > 0,
    })
}

export function useCreateAttribute() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateAttributePayload) => attributesApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: attributeKeys.all })
        },
    })
}

export function useUpdateAttribute() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateAttributePayload }) =>
            attributesApi.update(id, data),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: attributeKeys.detail(variables.id) })
            await queryClient.invalidateQueries({ queryKey: attributeKeys.list() })
        },
    })
}

export function useDeleteAttribute() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => attributesApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: attributeKeys.all })
        },
    })
}
