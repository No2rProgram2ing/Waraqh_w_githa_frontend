import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patternsApi } from '../api/patternsApi'
import type { CreatePatternPayload, DesignPattern, UpdatePatternPayload } from '../types/pattern'

export const patternKeys = {
    all: ['admin', 'patterns'] as const,
    list: () => [...patternKeys.all, 'list'] as const,
}

export function usePatterns() {
    return useQuery({
        queryKey: patternKeys.list(),
        queryFn: () => patternsApi.getAll(),
    })
}

export function useCreatePattern() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreatePatternPayload) => patternsApi.create(data),
        onSuccess: async (createdPattern) => {
            queryClient.setQueryData<DesignPattern[]>(patternKeys.list(), (previous = []) => [
                ...previous,
                createdPattern,
            ])
            await queryClient.invalidateQueries({ queryKey: patternKeys.all })
        },
    })
}

export function useUpdatePattern() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePatternPayload }) =>
            patternsApi.update(id, data),
        onSuccess: async (updatedPattern) => {
            queryClient.setQueryData<DesignPattern[]>(patternKeys.list(), (previous = []) =>
                previous.map((pattern) => (pattern.id === updatedPattern.id ? updatedPattern : pattern))
            )
            await queryClient.invalidateQueries({ queryKey: patternKeys.all })
        },
    })
}

export function useDeletePattern() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => patternsApi.delete(id),
        onSuccess: async (_, id) => {
            queryClient.setQueryData<DesignPattern[]>(patternKeys.list(), (previous = []) =>
                previous.filter((pattern) => pattern.id !== id)
            )
            await queryClient.invalidateQueries({ queryKey: patternKeys.all })
        },
    })
}
