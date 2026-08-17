export interface ReturnItem {
  id: number
  name: string
  qty: number
  price: number
}

export interface ReturnRequest {
  id?: number
  order_id?: number
  order_number?: string
  customer_name?: string
  reason?: string
  status?: 'pending' | 'approved' | 'rejected' | 'processed'
  items?: ReturnItem[]
  attachments?: string[]
  created_at?: string
}

export interface ReturnsListResponse {
  data: ReturnRequest[]
  meta?: { total?: number }
}
