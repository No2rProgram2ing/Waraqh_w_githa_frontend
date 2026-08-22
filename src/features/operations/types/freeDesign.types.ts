export type FreeDesignStatus = 'new' | 'in_review' | 'quoted' | 'converted' | 'rejected'

export interface FreeDesignRequest {
  id: number
  customer: {
    id: number | null
    full_name: string | null
  }
  description: string | null
  status: FreeDesignStatus
  created_at: string | null
  updated_at: string | null
}
