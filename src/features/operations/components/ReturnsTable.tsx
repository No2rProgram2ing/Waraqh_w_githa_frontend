import type { ReturnRequest } from '../types/returns.types'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableShell } from '@/components/shared/TableShell'

function getReturnStatusVariant(
  status: string | undefined,
): BadgeVariant {
  switch (status) {
    case 'approved':
    case 'completed':
      return 'success'
    case 'pending':
    case 'processing':
      return 'warning'
    case 'rejected':
    case 'cancelled':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function ReturnsTable({
  returnsList,
  onOpen,
}: {
  returnsList: ReturnRequest[]
  onOpen: (id: number) => void
}) {
  if (!returnsList.length) {
    return <EmptyState>لا توجد طلبات استبدال حالياً.</EmptyState>
  }

  return (
    <TableShell minWidth="800px">
      <thead className="bg-[var(--color-surface)]">
        <tr className="border-b border-[var(--color-border)]">
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            رقم الطلب
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            العميل
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            الحالة
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            السبب
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            إجراءات
          </th>
        </tr>
      </thead>

      <tbody>
        {returnsList.map((request) => (
          <tr
            key={request.id}
            className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]"
          >
            <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text-primary)]">
              {request.order_number ?? '—'}
            </td>

            <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
              {request.customer_name ?? '—'}
            </td>

            <td className="px-5 py-4">
              <Badge variant={getReturnStatusVariant(request.status)}>
                {request.status}
              </Badge>
            </td>

            <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
              {request.reason ?? '—'}
            </td>

            <td className="px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  if (request.id != null) {
                    onOpen(request.id)
                  }
                }}
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
