import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { DashboardStats, DashboardOrder, FeaturedProduct } from '../types/dashboard.types'

export const dashboardApi = {
  async getStats(params?: { from?: string; to?: string }): Promise<DashboardStats> {
    const response = await axiosAdminClient.get('/admin/orders-statistics', { params })
    const stats = response.data.data ?? response.data ?? {}
    
    return {
      total_orders: stats.total_orders ?? 0,
      pending: stats.pending ?? 0,
      production: stats.production ?? 0,
      completed: stats.completed ?? 0,
      total_revenue: stats.total_revenue,
      paid_orders_count: stats.paid_orders_count ?? 0,
      avg_order_value: stats.avg_order_value ?? 0,
      sales_timeseries: stats.sales_timeseries,
    }
  },

  async getLatestOrders(per_page = 5): Promise<DashboardOrder[]> {
    const response = await axiosAdminClient.get('/admin/orders', { params: { per_page } })
    const orders = (response.data.data ?? []) as DashboardOrder[]
    return orders
  },

  async getFeaturedProducts(per_page = 6): Promise<FeaturedProduct[]> {
    const response = await axiosAdminClient.get('/admin/products', { params: { per_page } })
    const products = (response.data.data ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.media && p.media.length ? p.media[0].url : undefined,
    }))

    return products as FeaturedProduct[]
  },
}
