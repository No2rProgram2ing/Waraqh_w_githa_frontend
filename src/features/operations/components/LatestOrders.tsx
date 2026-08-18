import type { DashboardOrder } from '../types/dashboard.types'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/shared/EmptyState'

interface LatestOrdersProps {
  orders?: DashboardOrder[]
}

function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'done':
      return 'success'
    case 'in_progress':
      return 'warning'
    case 'blocked':
      return 'danger'
    case 'pending':
      return 'info'
    default:
      return 'neutral'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'done':
      return 'مكتمل'
    case 'in_progress':
      return 'قيد التنفيذ'
    case 'blocked':
      return 'متوقف'
    case 'pending':
      return 'قيد الانتظار'
    default:
      return status
  }
}

export function LatestOrders({
  orders = [],
}: LatestOrdersProps) {
  if (orders.length === 0) {
    return <EmptyState>لا توجد طلبات حديثة</EmptyState>
  }

  return (
    <Card className="p-5">
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 last:border-b-0 last:pb-0"
          >
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                #{order.order_number}
              </p>

              <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
                {order.customer?.name ?? 'عميل'}
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-faint)]">
                {new Date(order.created_at).toLocaleDateString('ar-SA')}
              </p>
            </div>

            <div className="shrink-0 text-left">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {Number(order.total).toLocaleString('ar-SA')} ر.س
              </p>

              <div className="mt-1">
                <Badge variant={getStatusVariant(order.status)}>
                  {statusLabel(order.status)}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}