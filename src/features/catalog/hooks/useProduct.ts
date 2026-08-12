import { useQuery } from '@tanstack/react-query'

import { productsApi } from '../api/productsApi'

export function useProduct(id: number) {
    return useQuery({
        queryKey: ['admin', 'product', id],
        queryFn: () => productsApi.getById(id),
        enabled: Number.isInteger(id) && id > 0,
    })
}