export interface RawMaterial {
  id: number
  name: string
  sku?: string
  unit?: string
  stock_level: number
  reorder_level?: number
}

export interface StockMovement {
  id: number
  material_id: number
  change: number
  reason?: string
  created_at?: string
}
