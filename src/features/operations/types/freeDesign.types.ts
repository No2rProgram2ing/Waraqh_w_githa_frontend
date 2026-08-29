export type FreeDesignStatus =
  | 'new'
  | 'in_review'
  | 'quoted'
  | 'converted'
  | 'rejected'

export interface FreeDesignImage {
  id: number
  url: string
  sort_order: number
}

export interface FreeDesignRequest {
  id: number
  customer: {
    id: number | null
    full_name: string | null
  }
  description: string | null
  status: FreeDesignStatus
  quoted_price: string | null
  images?: FreeDesignImage[]
  created_at: string | null
  updated_at: string | null
}
