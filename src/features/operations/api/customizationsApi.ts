import { adminClient } from '@/lib/api/adminClient'
import type { CustomizationRequest, CustomizationStatus } from '../types/customizations.types'

export const customizationsApi = {
  async list(): Promise<{
    data: CustomizationRequest[]
    meta?: {
      current_page?: number
      last_page?: number
      per_page?: number
      total?: number
    }
  }> {
    const r = await adminClient.get('/admin/customizations')

    return {
      ...r.data,
      data: Array.isArray(r.data?.data)
        ? (r.data.data as CustomizationRequest[])
        : [],
    }
  },
  async create(payload: Record<string, unknown>) {
    const r = await adminClient.post('/admin/customizations', payload)
    return (r.data?.data ?? r.data) as CustomizationRequest
  },

  async getById(id: number): Promise<CustomizationRequest> {
    const r = await adminClient.get(`/admin/customizations/${id}`)
    return (r.data?.data ?? r.data) as CustomizationRequest
  },

  async updateStatus(id: number, status: CustomizationStatus) {
    const r = await adminClient.put(`/admin/customizations/${id}/status`, { status })
    return r.data
  },

  async delete(id: number) {
    const r = await adminClient.delete(`/admin/customizations/${id}`)
    return r.data
  },
}
