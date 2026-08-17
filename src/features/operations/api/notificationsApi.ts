import { axiosAdminClient } from '@/api/axiosAdminClient'

export const notificationsApi = {
  async getAll() {
    const response = await axiosAdminClient.get('/admin/notifications')
    return response.data
  },
}
