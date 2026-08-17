import { useQuery } from '@tanstack/react-query'
import { paymentsApi } from '../api/paymentsApi'
import { paymentsKeys } from './keys'

export function usePayments(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: paymentsKeys.list(params),
    queryFn: () => paymentsApi.list(params),
    keepPreviousData: true,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function usePayment(id?: number | null) {
  return useQuery({
    queryKey: paymentsKeys.detail(id ?? 'null'),
    queryFn: () => (id ? paymentsApi.getById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}
