import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { Payment, PaymentsListResponse } from '../types/payments.types'

export const paymentsApi = {
  async list(params: Record<string, any> = {}): Promise<PaymentsListResponse> {
    const response = await axiosAdminClient.get('/admin/payments', { params })
    return response.data
  },

  async getById(id: number): Promise<Payment> {
    const response = await axiosAdminClient.get(`/admin/payments/${id}`)
    return response.data
  },

  async exportCsv(params: Record<string, any> = {}) {
    // Optional server-side export endpoint
    const response = await axiosAdminClient.get('/admin/payments/export', { params })
    return response.data
  },
}
