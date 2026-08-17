import { axiosAdminClient } from '@/api/axiosAdminClient'

export const reportsApi = {
  async getBusinessReport(params: Record<string, any> = {}) {
    const response = await axiosAdminClient.get('/admin/reports', { params })
    return response.data
  },
}
