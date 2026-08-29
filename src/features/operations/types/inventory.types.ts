export type RawMaterialStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface RawMaterial {
  id: number
  product_id?: number | null
  name: string
  unit: string
  quantity_available: number
  reorder_point: number
  status: RawMaterialStatus
  created_at?: string
  updated_at?: string
}
