import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { Product } from '@/features/catalog/types/product'

export interface SearchFiltersDTO {
  q?: string
  category_id?: number
  min_price?: number | string
  max_price?: number | string
  in_stock?: boolean
  sort_by?: string
  page?: number
  per_page?: number
}

export interface SearchResponsePayload {
  data: Product[]
  links?: Record<string, any>
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const searchApi = {
  async getProducts(params: SearchFiltersDTO = {}): Promise<SearchResponsePayload> {
    const response = await axiosAdminClient.get<SearchResponsePayload>('/products', {
      params,
    })

    return response.data
  },

  async getCategories(): Promise<{ data: { id: number; name: string }[] } | any> {
    const response = await axiosAdminClient.get('/categories')
    return response.data
  },
}
