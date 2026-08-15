export interface ProductCategory {
  id: number
  name: string
  slug: string
  image_url: string | null
  parent_id: number | null
  children_count?: number
  created_at: string
  updated_at: string | null
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  image_url?: string | null
  parent_id?: number | null
}

export interface UpdateCategoryPayload {
  name?: string
  slug?: string
  image_url?: string | null
  parent_id?: number | null
}