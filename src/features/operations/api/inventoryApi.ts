import { axiosAdminClient } from '@/api/axiosAdminClient'

export const inventoryApi = {
  async getRawMaterials(params: Record<string, any> = {}) {
    const response = await axiosAdminClient.get('/admin/raw-materials', { params })
    return response.data
  },
}
