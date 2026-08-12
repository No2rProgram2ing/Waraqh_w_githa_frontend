import { axiosAdminClient } from '@/api/axiosAdminClient'

import type { Product } from '../types/product'

export interface ProductsQueryParams {
  page?: number
  search?: string
}

export interface PaginationLink {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export interface ProductsPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface ProductsPaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface ProductsResponse {
  data: Product[]
  links: ProductsPaginationLinks
  meta: ProductsPaginationMeta
}

export interface UpdateProductPayload {
  name: string
  sku: string
  description: string | null
  price: string
  stock_quantity: number
  status: 'active' | 'inactive'
  is_customizable: boolean
  category_id: number
}

export const productsApi = {
  async getAll(
    params: ProductsQueryParams = {},
  ): Promise<ProductsResponse> {
    const response =
      await axiosAdminClient.get<ProductsResponse>(
        '/admin/products',
        {
          params,
        },
      )

    return response.data
  },

  async getById(id: number): Promise<Product> {
    const response =
      await axiosAdminClient.get<{ data: Product }>(
        `/admin/products/${id}`,
      )

    return response.data.data
  },

  async update(
    id: number,
    data: UpdateProductPayload,
  ): Promise<void> {
    await axiosAdminClient.put(
      `/admin/products/${id}`,
      data,
    )
  },
}