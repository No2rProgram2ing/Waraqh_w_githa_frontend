import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { DashboardStats, DashboardOrder, FeaturedProduct } from '../types/dashboard.types'

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    // Prefer a dedicated dashboard endpoint if available
    try {
      const response = await axiosAdminClient.get('/admin/dashboard/statistics')
      return response.data.data ?? response.data
    } catch (err: any) {
      // Fallback to orders-statistics if dashboard endpoint not available
      if (err?.response?.status === 404 || err?.response?.status === 400) {
        const resp = await axiosAdminClient.get('/admin/orders-statistics')
        const stats = resp.data ?? {}
        return {
          total_orders: stats.total_orders ?? 0,
          pending: stats.pending ?? 0,
          production: stats.production ?? 0,
          completed: stats.completed ?? 0,
        }
      }

      throw err
    }
  },

  async getLatestOrders(per_page = 5): Promise<DashboardOrder[]> {
    const response = await axiosAdminClient.get('/admin/orders', { params: { per_page } })
    return (response.data.data ?? []) as DashboardOrder[]
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
