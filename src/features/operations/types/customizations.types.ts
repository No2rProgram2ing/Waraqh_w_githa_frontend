export type CustomizationStatus = 'pending_approval' | 'in_production' | 'completed'

export interface CustomizationRequest {
  id: number
  request_code: string
  customer?: { id: number | null; name: string | null }
  product: { id: number | null; name: string | null }
  color?: string | null
  design_pattern?: string | null
  quantity: number
  dimensions: {
    length?: number
    width?: number
    height?: number
  }
  attributes?: CustomizationAttributeValue[]
  price: {
    base: number
    customization: number
    total: number
  }
  status: CustomizationStatus | string
  created_at?: string
}

export interface CustomizationAttributeValue {
  id: number
  attribute_id: number
  name: string | null
  display_name: string | null
  input_type: string | null
  value: string
}
