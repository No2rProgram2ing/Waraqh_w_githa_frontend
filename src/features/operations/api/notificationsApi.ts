import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { NotificationItem } from '../types/notification.types'

export const notificationsApi = {
  async list(params: Record<string, any> = {}){
    try {
      const resp = await axiosAdminClient.get('/admin/notifications', { params })
      return resp.data
    } catch (err) {
      const key = 'local_notifications'
      const raw = localStorage.getItem(key)
      return { data: raw ? JSON.parse(raw) : [] }
    }
  },

  async markRead(ids: number[]){
    try {
      const resp = await axiosAdminClient.post('/admin/notifications/mark-read', { ids })
      return resp.data
    } catch (err) {
      const key = 'local_notifications'
      const raw = localStorage.getItem(key)
      const arr = raw ? JSON.parse(raw) : []
      const updated = arr.map((n: any) => ids.includes(n.id) ? { ...n, read: true } : n)
      localStorage.setItem(key, JSON.stringify(updated))
      return { data: updated }
    }
  }
}
