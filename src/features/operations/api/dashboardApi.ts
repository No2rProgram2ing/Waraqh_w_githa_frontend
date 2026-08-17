import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { DashboardStats, DashboardOrder, FeaturedProduct } from '../types/dashboard.types'

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const response = await axiosAdminClient.get('/admin/orders-statistics')
    return response.data
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
