import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../api/ordersApi'
import { ordersKeys } from './keys'

export function useOrders(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ordersKeys.all(params),
    queryFn: () => ordersApi.list(params),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useOrder(id?: number | null) {
  return useQuery({
    queryKey: ordersKeys.detail(id ?? 'null'),
    queryFn: () => (id ? ordersApi.getById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}