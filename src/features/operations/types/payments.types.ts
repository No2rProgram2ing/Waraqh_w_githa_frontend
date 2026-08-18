export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded'

export interface Payment {
  id: number
  order_number: string
  customer_name: string
  amount: number
  currency?: string
  method: string
  status: PaymentStatus
  paid_at?: string | null
  receipt_url?: string | null
}

export interface PaymentsListResponse {
  data: Payment[]
  meta?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}
