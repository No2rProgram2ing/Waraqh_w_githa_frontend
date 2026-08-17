export interface QualityImage {
  id: number
  url: string
  filename?: string
}

export interface QualityReview {
  id: number
  order_id: number
  order_number: string
  product_name?: string
  customer_name?: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  images?: QualityImage[]
  created_at?: string
}
