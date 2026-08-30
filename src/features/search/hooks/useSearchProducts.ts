import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/api/search'
import type { SearchFiltersDTO, SearchResponsePayload } from '@/api/search'

export function useSearchProducts(filters: SearchFiltersDTO) {
  // react-query will include the filter object in the key; keepPreviousData avoids UI flicker
  return useQuery<SearchResponsePayload>({
    queryKey: ['search', 'products', filters],
    queryFn: async () => searchApi.getProducts(filters),
    keepPreviousData: true,
    staleTime: 10_000,
    placeholderData: (previous) => previous as SearchResponsePayload | undefined,
  })
}

export function useSearchCategories() {
  return useQuery({
    queryKey: ['search', 'categories'],
    queryFn: async () => searchApi.getCategories(),
    staleTime: 60_000,
  })
}
