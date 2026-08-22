import type { ProductCategory } from './product-category'
import type { ProductMedia } from './product-media'

export type ProductStatus = 'active' | 'inactive'

export type ProductAttributeInputType =
  | 'text'
  | 'number'
  | 'select'
  | 'color'
  | 'boolean'

export interface ProductAttributeAssignment {
  id: number
  name: string
  display_name: string
  input_type: ProductAttributeInputType
  is_required: boolean
  options: string[] | null
  value: string
  attribute_value_id: number
}

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
  attributes?: ProductAttributeAssignment[]
  created_at: string
}
