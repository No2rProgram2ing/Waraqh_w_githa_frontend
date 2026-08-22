export type CustomizationStatus = 'pending_approval' | 'in_production' | 'completed'

export interface CustomizationRequest {
  id: number
  request_code: string
  customer?: { id: number | null; name: string | null }
  product: { id: number | null; name: string | null }
  color?: string | null
  design_pattern?: string | null
  quantity: number
  dimensions: { length?: number; width?: number; height?: number }
  price: { base: number; customization: number; total: number }
  status: CustomizationStatus | string
  created_at?: string
}
