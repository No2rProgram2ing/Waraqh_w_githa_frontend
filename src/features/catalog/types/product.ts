import type { ProductCategory } from './product-category'
import type { ProductMedia } from './product-media'

export type ProductStatus = 'active' | 'inactive'

export interface Product {
  id: number
  name: string
  sku: string
  description: string | null
  price: string
  stock_quantity: number
  status: ProductStatus
  is_customizable: boolean
  category?: ProductCategory
  media?: ProductMedia[]
  created_at: string
}
