import { axiosAdminClient } from '@/api/axiosAdminClient'

export const ordersApi = {
  async getAll(params: Record<string, any> = {}) {
    const response = await axiosAdminClient.get('/admin/orders', { params })
    return response.data
  },

  async getById(id: number) {
    const response = await axiosAdminClient.get(`/admin/orders/${id}`)
    return response.data
  },
}
