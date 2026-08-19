import React from 'react'
import type { ReportsKpi } from '../types/reports.types'
import { DashboardKpiCard } from './DashboardKpiCard'
import { ShoppingCart, TrendingUp, CreditCard } from 'lucide-react'

export function ReportsKpiCards({ kpi }: { kpi?: ReportsKpi | null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DashboardKpiCard
        title="إجمالي الطلبات"
        icon={ShoppingCart}
        value={kpi?.total_orders ?? '---'}
        variant="normal"
      />
      <DashboardKpiCard
        title="إجمالي الإيرادات"
        icon={TrendingUp}
        value={kpi?.total_revenue ? `${Number(kpi.total_revenue).toLocaleString('ar-SA')} ر.س` : '---'}
        variant="positive"
      />
      <DashboardKpiCard
        title="متوسط قيمة الطلب"
        icon={CreditCard}
        value={kpi?.avg_order_value ? `${Number(kpi.avg_order_value).toLocaleString('ar-SA')} ر.س` : '---'}
        variant="normal"
      />
    </div>
  )
}
