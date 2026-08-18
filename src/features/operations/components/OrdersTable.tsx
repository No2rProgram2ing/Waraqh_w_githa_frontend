import type { Order } from '../types/orders.types'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'

function getOrderStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'done':
      return 'success'
    case 'in_progress':
      return 'warning'
    case 'blocked':
      return 'danger'
    case 'pending':
      return 'neutral'
    default:
      return 'info'
  }
}

export function OrdersTable({
  orders,
  onOpen,
}: {
  orders: Order[]
  onOpen: (id: number) => void
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)]">
      <table className="w-full min-w-[900px] text-right">
        <thead className="bg-[var(--color-surface)]">
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              رقم الطلب
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              العميل
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              المنتج
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              السعر
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              الحالة
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              تاريخ الإنشاء
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              إجراءات
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-[var(--color-border)] align-top transition-colors last:border-b-0 hover:bg-[var(--color-surface-subtle)]"
            >
              <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text-primary)]">
                {order.order_number}
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {order.customer?.name ?? 'عميل'}
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {order.items?.length ? order.items[0].name : '—'}
              </td>

              <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text-primary)]">
                {order.total.toLocaleString('ar-SA')} ر.س
              </td>

              <td className="px-5 py-4">
                <Badge variant={getOrderStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {new Date(order.created_at).toLocaleString('ar-SA')}
              </td>

              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => onOpen(order.id)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  عرض
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
