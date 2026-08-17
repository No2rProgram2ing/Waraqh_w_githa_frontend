import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../api/ordersApi'
import { ordersKeys } from './keys'

export function useOrders(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ordersKeys.all(params),
    queryFn: () => ordersApi.getAll(params),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
