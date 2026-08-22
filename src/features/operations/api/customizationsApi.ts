import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { CustomizationRequest, CustomizationStatus } from '../types/customizations.types'

export const customizationsApi = {
  async list() {
    const r = await axiosAdminClient.get('/admin/customizations')
    return { ...r.data, data: Array.isArray(r.data?.data) ? r.data.data as CustomizationRequest[] : [] }
  },

  async create(payload: Record<string, unknown>) {
    const r = await axiosAdminClient.post('/admin/customizations', payload)
    return (r.data?.data ?? r.data) as CustomizationRequest
  },

  async getById(id: number): Promise<CustomizationRequest> {
    const r = await axiosAdminClient.get(`/admin/customizations/${id}`)
    return (r.data?.data ?? r.data) as CustomizationRequest
  },

  async updateStatus(id: number, status: CustomizationStatus) {
    const r = await axiosAdminClient.put(`/admin/customizations/${id}/status`, { status })
    return r.data
  },

  async delete(id: number) {
    const r = await axiosAdminClient.delete(`/admin/customizations/${id}`)
    return r.data
  },
}
