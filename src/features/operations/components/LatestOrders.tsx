import type { Order } from '../types/orders.types'
import { OpStatusBadge } from './OpStatusBadge'
import { useSystemCurrency } from '@/lib/currency'

interface LatestOrdersProps {
  orders?: Order[]
}

export function LatestOrders({ orders = [] }: LatestOrdersProps) {
  const { formatAmount } = useSystemCurrency()

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">لا توجد طلبات حديثة</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-right">
        <thead className="bg-[var(--color-surface)]">
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الطلب
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              العميل
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الإجمالي
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الحالة
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]"
            >
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  #{order.order_number}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  {new Date(order.created_at).toLocaleDateString('ar-SA')}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {order.customer?.name ?? 'عميل'}
              </td>

              <td className="px-5 py-4 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]" dir="ltr" style={{textAlign: "right"}}>
                {formatAmount(order.total)}
              </td>

              <td className="px-5 py-4">
                <OpStatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}