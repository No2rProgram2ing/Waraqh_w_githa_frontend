import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '../api/categoriesApi'
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../types/product-category'

export const categoryKeys = {
    all: ['admin', 'categories'] as const,
    list: () => [...categoryKeys.all, 'list'] as const,
    detail: (id: number) => [...categoryKeys.all, 'detail', id] as const,
}

export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.list(),
        queryFn: async () => {
            const response = await categoriesApi.getAll()
            return response.data
        },
    })
}

export function useCreateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateCategoryPayload) => categoriesApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: categoryKeys.all })
        },
    })
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCategoryPayload }) => 
            categoriesApi.update(id, data),
        onSuccess: async (category) => {
            await queryClient.invalidateQueries({ queryKey: categoryKeys.detail(category.id) })
            await queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => categoriesApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: categoryKeys.all })
        },
    })
}
