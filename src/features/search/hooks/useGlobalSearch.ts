import { useQuery } from '@tanstack/react-query'

import { productsApi } from '@/features/catalog/api/productsApi'
import type { Product } from '@/features/catalog/types/product'
import { customersApi } from '@/features/customers/api/customersApi'
import type { Customer } from '@/features/customers/types/customer'

const MAX_RESULTS_PER_GROUP = 5

export interface GlobalSearchResponse {
  products: Product[]
  customers: Customer[]
}

export function useGlobalSearch(searchTerm: string) {
  const trimmedSearch = searchTerm.trim()

  return useQuery({
    queryKey: ['admin', 'global-search', trimmedSearch],
    enabled: trimmedSearch.length > 0,
    staleTime: 30_000,
    gcTime: 60_000,
    placeholderData: (previousData) => previousData as GlobalSearchResponse | undefined,
    queryFn: async (): Promise<GlobalSearchResponse> => {
      const [productsResponse, customersResponse] = await Promise.all([
        productsApi.getAll({
          search: trimmedSearch,
          page: 1,
          per_page: MAX_RESULTS_PER_GROUP,
        }),
        customersApi.getAll({
          search: trimmedSearch,
          per_page: MAX_RESULTS_PER_GROUP,
        }),
      ])

      return {
        products: productsResponse.data.slice(0, MAX_RESULTS_PER_GROUP),
        customers: customersResponse.data.slice(0, MAX_RESULTS_PER_GROUP),
      }
    },
  })
}
