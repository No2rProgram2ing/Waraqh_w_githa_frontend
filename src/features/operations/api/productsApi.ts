import { axiosAdminClient } from '@/api/axiosAdminClient'

export const productsApi = {
  async getAll(params: Record<string, any> = {}) {
    const response = await axiosAdminClient.get('/admin/products', { params })
    return response.data
  },
}
