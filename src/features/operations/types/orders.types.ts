export interface OrderCustomer {
  id: number | null
  name: string | null
  phone?: string | null
}

export interface OrderItem {
  id: number
  name: string
  qty: number
  price: number
}

export interface ProductionStage {
  key: string
  name: string
  status: 'pending' | 'in_progress' | 'done' | 'blocked'
  date?: string | null
}

export interface Order {
  id: number
  order_number: string
  customer: OrderCustomer
  items?: OrderItem[]
  total: number
  status: string
  created_at: string
  production_stages?: ProductionStage[]
}

export interface OrdersListResponse {
  data: Order[]
  meta?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}
