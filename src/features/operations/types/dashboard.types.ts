export interface SalesPoint {
  date: string
  revenue: number
  orders_count?: number
}

export interface DashboardStats {
  total_orders: number
  pending: number
  production: number
  completed: number
  total_revenue?: number
  paid_orders_count?: number
  avg_order_value?: number
  sales_timeseries?: SalesPoint[]
}

export interface DashboardOrderCustomer {
  id: number | null
  name: string | null
}

export interface DashboardOrder {
  id: number
  order_number: string
  type?: string | null
  status: string
  customer: DashboardOrderCustomer
  total: number
  created_at: string
}

export interface FeaturedProduct {
  id: number
  name: string
  price?: string | number
  image?: string
}
