import { adminClient } from '@/lib/api/adminClient'
import type { FreeDesignRequest, FreeDesignStatus } from '../types/freeDesign.types'

export interface FreeDesignListResponse {
  data: FreeDesignRequest[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface FreeDesignUpdatePayload {
  status?: FreeDesignStatus
  description?: string
  quoted_price?: number | null
}

export const freeDesignApi = {
  async list(
    params: {
      page?: number
      per_page?: number
      search?: string
      status?: string
    } = {},
  ) {
    const response = await adminClient.get<FreeDesignListResponse>(
      '/admin/custom-design-requests',
      { params },
    )

    return response.data
  },

  async create(payload: FormData) {
    const response = await adminClient.post<{
      data: FreeDesignRequest
    }>('/admin/custom-design-requests', payload)

    return response.data
  },

  async show(id: number) {
    const response = await adminClient.get<{
      data: FreeDesignRequest
    }>(`/admin/custom-design-requests/${id}`)

    return response.data
  },

  async update(id: number, payload: FormData) {
    payload.append('_method', 'PUT')

    const response = await adminClient.post<{
      data: FreeDesignRequest
    }>(`/admin/custom-design-requests/${id}`, payload)

    return response.data
  },

  async deleteImage(requestId: number, imageId: number) {
    return adminClient.delete(
      `/admin/custom-design-requests/${requestId}/images/${imageId}`,
    )
  },

  async remove(id: number) {
    return adminClient.delete(
      `/admin/custom-design-requests/${id}`,
    )
  },
}