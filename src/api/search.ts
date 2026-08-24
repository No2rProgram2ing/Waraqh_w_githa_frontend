import { customerApi } from '@/api/customerApi'
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

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const record = payload as Record<string, unknown>
  const candidates = [record.data, record.products, record.items, record.result, record.records]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }
  }

  return []
}

export const searchApi = {
  async getProducts(params: SearchFiltersDTO = {}): Promise<SearchResponsePayload> {
    const response = await customerApi.get<unknown>('/products', { params })
    const payload = response.data
    const data = extractArray(payload) as Product[]

    const metaSource = payload && typeof payload === 'object' ? (payload as Record<string, unknown>).meta : undefined
    const meta = metaSource && typeof metaSource === 'object'
      ? (metaSource as Record<string, unknown>)
      : {}

    return {
      data,
      meta: {
        current_page: Number(meta.current_page ?? 1),
        last_page: Number(meta.last_page ?? 1),
        per_page: Number(meta.per_page ?? params.per_page ?? (data.length > 0 ? data.length : 12)),
        total: Number(meta.total ?? data.length),
      },
    }
  },

  async getCategories(): Promise<{ data: { id: number; name: string }[] } | any> {
    const response = await customerApi.get<unknown>('/categories')
    const payload = response.data
    return { data: extractArray(payload) as { id: number; name: string }[] }
  },
}
