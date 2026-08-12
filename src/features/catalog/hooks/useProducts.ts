import { useQuery } from '@tanstack/react-query'

import { productsApi } from '../api/productsApi'
import type { ProductsQueryParams } from '../api/productsApi'

export function useProducts(params: ProductsQueryParams = {}) {
    return useQuery({
        queryKey: ['admin', 'products', params],
        queryFn: () => productsApi.getAll(params),
        placeholderData: (previousData) => previousData,
    })
}