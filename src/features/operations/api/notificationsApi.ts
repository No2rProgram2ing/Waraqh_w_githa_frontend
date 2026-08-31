import { adminClient } from '@/lib/api/adminClient'

export const notificationsApi = {
  async list(params: Record<string, unknown> = {}) {
    const r = await adminClient.get('/admin/notifications', { params })
    return {
      ...r.data,
      data: (r.data?.data ?? []).map((n: any) => ({
        ...n,
        title: n.title ?? n.type ?? 'إشعار',
        message: n.message ?? n.body ?? '',
        read: Boolean(n.read ?? n.is_read),
      })),
    }
  },

  async markRead(id: number) {
    const r = await adminClient.put(`/admin/notifications/${id}/read`)
    return r.data
  },
}
