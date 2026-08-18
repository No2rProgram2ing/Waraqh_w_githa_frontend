import { axiosAdminClient } from '@/api/axiosAdminClient'

export const productionApi = {
  async getHistory(orderId: number){
    try {
      const resp = await axiosAdminClient.get(`/admin/orders/${orderId}/production-history`)
      return resp.data
    } catch (err) {
      // fallback: read localStorage
      const key = `order_stages_${orderId}`
      const raw = localStorage.getItem(key)
      return { data: raw ? JSON.parse(raw) : [] }
    }
  },

  async updateStage(orderId: number, stageKey: string, payload: Record<string, any>){
    try {
      const resp = await axiosAdminClient.post(`/admin/orders/${orderId}/production-history/${stageKey}`, payload)
      return resp.data
    } catch (err) {
      // fallback: update localStorage
      const key = `order_stages_${orderId}`
      const raw = localStorage.getItem(key)
      const arr = raw ? JSON.parse(raw) : []
      const updated = arr.map((s: any) => (s.key === stageKey ? { ...s, ...payload } : s))
      localStorage.setItem(key, JSON.stringify(updated))
      return { data: updated }
    }
  }
}
