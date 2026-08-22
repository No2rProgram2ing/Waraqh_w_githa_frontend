export type PaymentStatus = 'paid' | 'unpaid' | 'failed'
export type PaymentMethod = 'jawali' | 'jeeb' | 'al_kuraimi'

export interface Payment {
  id: number
  order_id?: number
  order_number: string
  customer_name: string
  amount: number
  currency?: string
  method: PaymentMethod | string
  status: PaymentStatus | string
  paid_at?: string | null
  created_at?: string | null
}

export interface PaymentsListResponse {
  data: Payment[]
  meta?: { total: number; per_page: number; current_page: number; last_page: number }
  links?: Record<string, string | null>
}
