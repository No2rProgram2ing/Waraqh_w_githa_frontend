export interface ReportsKpi {
  total_orders?: number
  total_revenue?: number
  avg_order_value?: number
}

export interface ReportRow {
  date: string
  orders: number
  revenue: number
  avg_value?: number
}

export interface ReportsResponse {
  data: ReportRow[]
  kpi?: ReportsKpi
  meta?: { total?: number }
}
