import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { ordersApi } from '../api/ordersApi'
import { ordersKeys } from './keys'

export function useOrders(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ordersKeys.all(params),
    queryFn: () => ordersApi.list(params),
    placeholderData: keepPreviousData,
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

// الـ Hook المفقود لإنشاء طلب جديد
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: any) => ordersApi.create(payload),
    onSuccess: () => {
      // تحديث قائم الطلبات تلقائياً بعد إضافة طلب جديد
      queryClient.invalidateQueries({ queryKey: ordersKeys.all({}) })
    },
  })
}