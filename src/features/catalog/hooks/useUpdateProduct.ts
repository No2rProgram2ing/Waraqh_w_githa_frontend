import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productsApi } from '../api/productsApi'
import type { ProductAttributeValuePayload } from '../api/productsApi'

export interface UpdateProductData {
  name: string
  sku: string
  description: string | null
  price: string
  stock_quantity: number
  status: 'active' | 'inactive'
  is_customizable: boolean
  category_id: number
  attribute_values?: ProductAttributeValuePayload[]
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: UpdateProductData
    }) => productsApi.update(id, data),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['admin', 'products'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['admin', 'product', variables.id],
        }),
      ])
    },
  })
}
