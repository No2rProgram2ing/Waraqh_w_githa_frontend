import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'

import { ordersApi } from '../api/ordersApi'
import { ordersKeys } from './keys'

import type {
  OrderStatus,
  CreateOrderPayload,
} from '../types/orders.types'

export function useOrders(
  params: {
    page?: number
    per_page?: number
  } = {},
) {
  return useQuery({
    queryKey: ordersKeys.all(params),

    queryFn: () =>
      ordersApi.list(params),

    placeholderData:
      keepPreviousData,

    staleTime: 30_000,

    refetchOnWindowFocus: false,
  })
}

export function useOrder(
  id?: number | null,
) {
  return useQuery({
    queryKey:
      ordersKeys.detail(
        id ?? 'null',
      ),

    queryFn: () =>
      ordersApi.getById(
        Number(id),
      ),

    enabled:
      id != null &&
      Number.isFinite(
        Number(id),
      ),

    staleTime: 30_000,
  })
}

/**
 * إنشاء طلب جديد
 */
export function useCreateOrder() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (
      payload: CreateOrderPayload,
    ) =>
      ordersApi.create(
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'admin',
          'orders',
        ],
      })
    },
  })
}

/**
 * تحديث حالة الطلب
 */
export function useUpdateOrderStatus() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: number
      status: OrderStatus
      note?: string
    }) =>
      ordersApi.updateStatus(
        id,
        status,
        note,
      ),

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          'admin',
          'orders',
        ],
      })

      queryClient.invalidateQueries({
        queryKey:
          ordersKeys.detail(
            variables.id,
          ),
      })
    },
  })
}

/**
 * حذف الطلب
 */
export function useDeleteOrder() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (
      id: number,
    ) =>
      ordersApi.delete(id),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [
          'admin',
          'orders',
        ],
      }),
  })
}

/**
 * سجل حالات الطلب
 */
export function useOrderStatusHistory(
  id?: number | null,
) {
  return useQuery({
    queryKey: [
      'admin',
      'orders',
      'status-history',
      id,
    ],

    queryFn: () =>
      ordersApi.getStatusHistory(
        Number(id),
      ),

    enabled:
      id != null &&
      Number.isFinite(
        Number(id),
      ),

    staleTime: 30_000,
  })
}