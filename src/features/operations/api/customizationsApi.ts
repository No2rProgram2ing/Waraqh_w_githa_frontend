import { axiosAdminClient } from '@/api/axiosAdminClient'

export const customizationsApi = {
  async getAll(params: Record<string, any> = {}) {
    const response = await axiosAdminClient.get('/admin/customizations', { params })
    return response.data
  },
}
