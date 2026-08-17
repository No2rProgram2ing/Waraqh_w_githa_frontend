import { axiosAdminClient } from '@/api/axiosAdminClient'

export const paymentsApi = {
  async refund(paymentId: number, payload: { amount?: number; reason?: string } = {}){
    try {
      const resp = await axiosAdminClient.post(`/admin/payments/${paymentId}/refund`, payload)
      return resp.data
    } catch (err) {
      // fallback: mark local payment as refunded
      const key = 'local_payments'
      const raw = localStorage.getItem(key)
      const arr = raw ? JSON.parse(raw) : []
      const idx = arr.findIndex((p: any) => p.id === paymentId)
      if (idx !== -1){
        arr[idx] = { ...arr[idx], status: 'refunded', refunded_at: new Date().toISOString(), refund_meta: payload }
        localStorage.setItem(key, JSON.stringify(arr))
        return { data: arr[idx] }
      }
      throw err
    }
  },

  async markPaid(paymentId: number){
    try {
      const resp = await axiosAdminClient.post(`/admin/payments/${paymentId}/mark-paid`)
      return resp.data
    } catch (err) {
      const key = 'local_payments'
      const raw = localStorage.getItem(key)
      const arr = raw ? JSON.parse(raw) : []
      const idx = arr.findIndex((p: any) => p.id === paymentId)
      if (idx !== -1){
        arr[idx] = { ...arr[idx], status: 'paid', paid_at: new Date().toISOString() }
        localStorage.setItem(key, JSON.stringify(arr))
        return { data: arr[idx] }
      }
      throw err
    }
  }
}
