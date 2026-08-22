import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { DashboardStats, DashboardOrder, FeaturedProduct } from '../types/dashboard.types'

export const dashboardApi = {
  async getStats(params?: { from?: string; to?: string }): Promise<DashboardStats> {
    const response = await axiosAdminClient.get('/admin/orders-statistics', { params })
    const stats = response.data?.data ?? response.data ?? {}

    return {
      total_orders: Number(stats.total_orders ?? 0),
      pending: Number(stats.pending ?? 0),
      production: Number(stats.production ?? 0),
      total_revenue: Number(stats.total_revenue ?? 0),
      paid_orders_count: Number(stats.paid_orders_count ?? 0),
      avg_order_value: Number(stats.avg_order_value ?? 0),
      sales_timeseries: Array.isArray(stats.sales_timeseries) ? stats.sales_timeseries : [],
    }
  },

  async getLatestOrders(per_page = 5): Promise<DashboardOrder[]> {
    const response = await axiosAdminClient.get('/admin/orders', { params: { per_page } })
    return Array.isArray(response.data?.data)
      ? response.data.data.map((o: any) => ({
          id: Number(o.id),
          order_number: String(o.order_number ?? o.id),
          type: o.type ?? o.order_type ?? null,
          status: o.status?.value ?? o.status,
          customer: {
            id: o.customer?.id ?? null,
            name: o.customer?.name ?? o.customer?.full_name ?? null,
          },
          total: Number(o.total ?? o.total_amount ?? 0),
          created_at: o.created_at,
        }))
      : []
  },

  async getFeaturedProducts(per_page = 6): Promise<FeaturedProduct[]> {
    const response = await axiosAdminClient.get('/admin/products', { params: { per_page } })
    return Array.isArray(response.data?.data)
      ? response.data.data.map((p: any) => ({
          id: Number(p.id),
          name: p.name,
          price: p.price,
          image: p.media?.[0]?.url,
        }))
      : []
  },
}
