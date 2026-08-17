import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { Order, OrdersListResponse } from '../types/orders.types'

export const ordersApi = {
  async list(params: Record<string, any> = {}): Promise<OrdersListResponse> {
    const response = await axiosAdminClient.get('/admin/orders', { params })
    return response.data
  },

  async getById(id: number): Promise<Order> {
    const response = await axiosAdminClient.get(`/admin/orders/${id}`)
    return response.data
  },

  async getProductionHistory(id: number) {
    const response = await axiosAdminClient.get(`/admin/orders/${id}/production-history`)
    return response.data
  },
}
