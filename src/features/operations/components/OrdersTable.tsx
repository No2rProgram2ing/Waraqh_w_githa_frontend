import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { Order } from '../types/orders.types'
import { OpStatusBadge } from './OpStatusBadge'
import { OpIconButton } from './OpIconButton'
import { useSystemCurrency } from '@/lib/currency'

interface OrdersTableProps {
  orders: Order[]
  onOpen: (id: number) => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  deletingId?: number | null
  isLoading?: boolean
}

export function OrdersTable({ orders, onOpen, onEdit, onDelete, deletingId = null, isLoading = false }: OrdersTableProps) {
  const { formatAmount } = useSystemCurrency()

  if (isLoading) return <div className="flex items-center justify-center px-5 py-16 text-sm text-[var(--color-text-muted)]">جارٍ تحميل الطلبات...</div>
  if (!orders.length) return <div className="flex items-center justify-center px-5 py-16 text-sm text-[var(--color-text-muted)]">لا توجد طلبات حالياً.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-right">
        <thead className="bg-[var(--color-surface-subtle)]">
          <tr className="border-b border-[var(--color-border)]">
            {['الطلب', 'العميل', 'المنتجات', 'الإجمالي', 'الحالة', 'الإجراءات'].map((h) => (
              <th key={h} className="px-5 py-3.5 text-xs font-semibold text-[var(--color-text-secondary)]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-subtle)]">
              <td className="px-5 py-4">
                <p className="text-sm font-semibold">#{o.order_number}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{o.created_at ? new Date(o.created_at).toLocaleDateString('ar-SA') : '—'}</p>
              </td>
              <td className="px-5 py-4 text-sm">{o.customer?.name ?? 'عميل'}</td>
              <td className="px-5 py-4 text-sm">
                {o.items?.[0]?.product?.name ?? '—'}
                {(o.items?.length ?? 0) > 1 && <span className="mr-1 text-xs text-gray-400">+{(o.items?.length ?? 0) - 1}</span>}
              </td>
              <td className="px-5 py-4 text-sm font-semibold tabular-nums">{formatAmount(o.total)}</td>
              <td className="px-5 py-4"><OpStatusBadge status={String(o.status)} /></td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1">
                  <OpIconButton icon={<Eye size={17} strokeWidth={1.8} />} label="عرض تفاصيل الطلب" onClick={() => onOpen(o.id)} />
                  <OpIconButton icon={<Pencil size={17} strokeWidth={1.8} />} label="تعديل الطلب" onClick={() => onEdit?.(o.id)} disabled={!onEdit} />
                  <OpIconButton icon={<Trash2 size={17} strokeWidth={1.8} />} label="حذف الطلب" tone="danger" onClick={() => onDelete?.(o.id)} disabled={!onDelete || deletingId === o.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
