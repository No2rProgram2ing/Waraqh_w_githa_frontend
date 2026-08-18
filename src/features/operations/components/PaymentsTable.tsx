import type { Payment } from '../types/payments.types'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { TableShell } from '@/components/shared/TableShell'

function getPaymentStatusVariant(status: Payment['status']): BadgeVariant {
  switch (status) {
    case 'success':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
      return 'danger'
    case 'refunded':
      return 'neutral'
    default:
      return 'info'
  }
}

export function PaymentsTable({
  payments,
  onOpenDetails,
}: {
  payments: Payment[]
  onOpenDetails: (id: number) => void
}) {
  return (
    <TableShell minWidth="900px">
      <thead className="bg-[var(--color-surface)]">
        <tr className="border-b border-[var(--color-border)]">
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            رقم الطلب
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            اسم العميل
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            طريقة الدفع
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            المبلغ
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            الحالة
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            تاريخ الدفع
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            تفاصيل
          </th>
        </tr>
      </thead>

      <tbody>
        {payments.map((payment) => (
          <tr
            key={payment.id}
            className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]"
          >
            <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text-primary)]">
              {payment.order_number}
            </td>

            <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
              {payment.customer_name}
            </td>

            <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
              {payment.method}
            </td>

            <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text-primary)]">
              {payment.amount.toLocaleString('ar-SA')} ر.س
            </td>

            <td className="px-5 py-4">
              <Badge variant={getPaymentStatusVariant(payment.status)}>
                {payment.status}
              </Badge>
            </td>

            <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
              {payment.paid_at
                ? new Date(payment.paid_at).toLocaleString('ar-SA')
                : '—'}
            </td>

            <td className="px-5 py-4">
              <button
                type="button"
                onClick={() => onOpenDetails(payment.id)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                عرض
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  )
}