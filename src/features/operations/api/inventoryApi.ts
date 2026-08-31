import { adminClient } from '@/lib/api/adminClient'
import type { RawMaterial } from '../types/inventory.types'

function unwrap(data: any): any { return data?.data ?? data }
export const inventoryApi = {
  async listMaterials() {
    const response = await adminClient.get('/admin/raw-materials')
    return { ...response.data, data: Array.isArray(unwrap(response.data)) ? unwrap(response.data) : [] }
  },
  async getById(id: number) { const response = await adminClient.get(`/admin/raw-materials/${id}`); return unwrap(response.data) as RawMaterial },
  async create(payload: Partial<RawMaterial>) { const response = await adminClient.post('/admin/raw-materials', payload); return unwrap(response.data) as RawMaterial },
  async update(id: number, payload: Partial<RawMaterial>) { const response = await adminClient.put(`/admin/raw-materials/${id}`, payload); return unwrap(response.data) as RawMaterial },
  async delete(id: number) { return adminClient.delete(`/admin/raw-materials/${id}`) },
}
