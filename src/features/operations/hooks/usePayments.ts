import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import { paymentsApi } from '../api/paymentsApi'
import { paymentsKeys } from './keys'

export function usePayments(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: paymentsKeys.list(params),
    queryFn: () => paymentsApi.list(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function usePayment(id?: number | null) {
  return useQuery({
    queryKey: paymentsKeys.detail(id ?? 'null'),
    queryFn: () => paymentsApi.getById(id as number),
    enabled: id != null,
    staleTime: 5 * 60 * 1000,
  })
}