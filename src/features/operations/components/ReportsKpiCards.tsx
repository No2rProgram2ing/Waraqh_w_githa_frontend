import React from 'react'
import type { ReportsKpi } from '../types/reports.types'

export function ReportsKpiCards({ kpi }: { kpi?: ReportsKpi | null }){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="rounded-2xl border bg-white p-4 text-right">
        <div className="text-sm">إجمالي الطلبات</div>
        <div className="mt-2 text-xl font-bold">{kpi?.total_orders ?? '---'}</div>
      </div>

      <div className="rounded-2xl border bg-white p-4 text-right">
        <div className="text-sm">إجمالي الإيرادات</div>
        <div className="mt-2 text-xl font-bold">{kpi?.total_revenue ? `${Number(kpi.total_revenue).toLocaleString('ar-SA')} ر.س` : '---'}</div>
      </div>

      <div className="rounded-2xl border bg-white p-4 text-right">
        <div className="text-sm">متوسط قيمة الطلب</div>
        <div className="mt-2 text-xl font-bold">{kpi?.avg_order_value ? `${Number(kpi.avg_order_value).toLocaleString('ar-SA')} ر.س` : '---'}</div>
      </div>
    </div>
  )
}
