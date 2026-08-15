import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { productsApi } from '../api/productsApi'
import type { CreateProductPayload, ProductsQueryParams } from '../api/productsApi'

export function useProducts(params: ProductsQueryParams = {}) {
    return useQuery({
        queryKey: ['admin', 'products', params],
        queryFn: () => productsApi.getAll(params),
        placeholderData: (previousData) => previousData,
    })
}

export function useCreateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateProductPayload) => productsApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
        },
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => productsApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
        },
    })
}