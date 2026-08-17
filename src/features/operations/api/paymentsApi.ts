import { axiosAdminClient } from '@/api/axiosAdminClient'

export const paymentsApi = {
  async getAll(params: Record<string, any> = {}) {
    const response = await axiosAdminClient.get('/admin/payments', { params })
    return response.data
  },
}
