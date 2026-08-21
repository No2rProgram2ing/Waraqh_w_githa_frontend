export interface CustomizationDimensions {
  width?: number
  height?: number
  depth?: number
}

export interface CustomizationOption {
  id: number
  name: string
  type?: 'weaving' | 'wood' | 'finish' | 'fabric' | string
  price?: number
  price_impact?: number
  is_active?: boolean
  description?: string
  image_url?: string
}

export interface CustomizationEstimate {
  base_price: number
  customization_fee: number
  shipping: number
  total: number
}

export interface CustomizationDraft {
  id?: number
  customer_name?: string
  customer_phone?: string
  address?: string
  product_id?: number | null
  quantity?: number
  dimensions?: CustomizationDimensions
  color?: string | null
  design_template_id?: number | null
  notes?: string
  attachments?: string[]
  status?: string
}