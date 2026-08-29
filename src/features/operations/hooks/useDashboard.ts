import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'
import { dashboardKeys } from './keys'

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: () => dashboardApi.getStats(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useLatestOrders(per_page = 5) {
  return useQuery({
    queryKey: dashboardKeys.latestOrders(per_page),
    queryFn: () => dashboardApi.getLatestOrders(per_page),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useFeaturedProducts(per_page = 6) {
  return useQuery({
    queryKey: dashboardKeys.featuredProducts(per_page),
    queryFn: () => dashboardApi.getFeaturedProducts(per_page),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
