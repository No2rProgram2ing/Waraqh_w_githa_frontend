import type { DashboardStats } from '../types/dashboard.types'
import { DashboardKpiCard } from './DashboardKpiCard'
import { ShoppingCart, TrendingUp, CreditCard } from 'lucide-react'
import { useSystemCurrency } from '@/lib/currency'

export function ReportsKpiCards({ kpi }: { kpi?: Partial<DashboardStats> | null }) {
  const { formatAmount } = useSystemCurrency()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DashboardKpiCard
        title="الطلبات المدفوعة"
        icon={ShoppingCart}
        value={kpi?.total_orders ?? '---'}
        variant="normal"
      />
      <DashboardKpiCard
        title="إجمالي الإيرادات"
        icon={TrendingUp}
        value={kpi?.total_revenue !== undefined ? formatAmount(Number(kpi.total_revenue)) : '---'}
        variant="positive"
      />
      <DashboardKpiCard
        title="متوسط قيمة الطلب"
        icon={CreditCard}
        value={kpi?.avg_order_value !== undefined ? formatAmount(Number(kpi.avg_order_value)) : '---'}
        variant="normal"
      />
    </div>
  )
}
