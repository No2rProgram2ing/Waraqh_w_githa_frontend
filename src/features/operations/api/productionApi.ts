import { axiosAdminClient } from '@/api/axiosAdminClient'

export const productionApi = {
  async getStages() {
    const response = await axiosAdminClient.get('/admin/production-stages')
    return response.data
  },
}
