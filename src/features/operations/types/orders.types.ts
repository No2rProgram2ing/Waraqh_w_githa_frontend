export type OrderStatus =
  | 'received'
  | 'in_production'
  | 'in_transit'
  | 'cancelled'

export type OrderType =
  | 'ready_made'
  | 'custom'
  | 'mixed'

export interface OrderCustomer {
  id: number | null
  name: string | null
  phone?: string | null
}

export interface OrderProduct {
  id: number
  name: string
  sku?: string | null
}

export interface OrderItem {
  id: number
  product: OrderProduct | null
  name?: string | null
  quantity: number
  qty?: number
  price: number
  customized?: boolean
  customization_id?: number | null
  customization_note?: string | null
}

export interface CreateOrderItemPayload {
  product_id: number
  quantity: number
  customization_id?: number | null
  customization_note?: string | null
}

export interface CreateOrderPayload {
  customer_id: number
  order_type: OrderType
  expected_delivery_date?: string | null
  shipping_fee?: number
  items: CreateOrderItemPayload[]
}

export interface ProductionStage {
  id: number
  key: string
  name: string
  status:
    | 'pending'
    | 'in_progress'
    | 'done'
  date?: string | null
}

export interface OrderPayment {
  id: number
  method?: string | null
  amount: number
  status: string
  paid_at?: string | null
}

export interface Order {
  id: number
  order_number: string
  type?: string | null

  customer: OrderCustomer

  product?: OrderProduct | null

  items?: OrderItem[]

  total: number

  status: OrderStatus | string

  created_at: string

  payment?: OrderPayment | null

  subtotal?: number

  shipping_fee?: number

  address?: {
    id: number
    city?: string
    district?: string
    street?: string
    phone?: string
  } | null

  status_history?: Array<{
    id: number
    status: string
    note?: string | null
    changed_by?: string | null
    created_at?: string
  }>
}

export interface OrdersListResponse {
  data: Order[]

  meta?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }

  links?: Record<string, string | null>
}