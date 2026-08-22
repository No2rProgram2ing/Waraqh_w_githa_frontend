import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { RawMaterial } from '../types/inventory.types'

function unwrap(data: any): any { return data?.data ?? data }
export const inventoryApi = {
  async listMaterials() {
    const response = await axiosAdminClient.get('/admin/raw-materials')
    return { ...response.data, data: Array.isArray(unwrap(response.data)) ? unwrap(response.data) : [] }
  },
  async getById(id: number) { const response = await axiosAdminClient.get(`/admin/raw-materials/${id}`); return unwrap(response.data) as RawMaterial },
  async create(payload: Partial<RawMaterial>) { const response = await axiosAdminClient.post('/admin/raw-materials', payload); return unwrap(response.data) as RawMaterial },
  async update(id: number, payload: Partial<RawMaterial>) { const response = await axiosAdminClient.put(`/admin/raw-materials/${id}`, payload); return unwrap(response.data) as RawMaterial },
  async delete(id: number) { return axiosAdminClient.delete(`/admin/raw-materials/${id}`) },
}
