import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { colorsApi } from '../api/colorsApi'
import type { CreateColorPayload, UpdateColorPayload } from '../types/color'

export const colorKeys = {
    all: ['admin', 'colors'] as const,
    list: () => [...colorKeys.all, 'list'] as const,
}

export function useColors() {
    return useQuery({
        queryKey: colorKeys.list(),
        queryFn: () => colorsApi.getAll(),
    })
}

export function useCreateColor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateColorPayload) => colorsApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: colorKeys.all })
        },
    })
}

export function useUpdateColor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateColorPayload }) =>
            colorsApi.update(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: colorKeys.all })
        },
    })
}

export function useDeleteColor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => colorsApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: colorKeys.all })
        },
    })
}
