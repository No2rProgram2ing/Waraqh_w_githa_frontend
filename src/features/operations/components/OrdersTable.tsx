import type { Order } from '../types/orders.types'
import { OpStatusBadge } from './OpStatusBadge'
import { Eye } from 'lucide-react'

interface OrdersToolbarProps {
  search: string
  onSearchChange: (v: string) => void
}

export function OrdersToolbar({ search, onSearchChange }: OrdersToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
      <div>
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">قائمة الطلبات</h2>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">جميع الطلبات المسجّلة في النظام</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="البحث عن طلب..."
          className="w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D] sm:w-64"
          aria-label="البحث عن طلب"
        />
      </div>
    </div>
  )
}

interface OrdersTableProps {
  orders: Order[]
  onOpen: (id: number) => void
  isLoading?: boolean
  searchTerm?: string
}

export function OrdersTable({ orders, onOpen, isLoading = false, searchTerm = '' }: OrdersTableProps) {
  const filtered = searchTerm
    ? orders.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : orders

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">جارٍ تحميل الطلبات...</p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          {searchTerm ? 'لا توجد نتائج مطابقة للبحث.' : 'لا توجد طلبات لعرضها.'}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] text-right">
        <thead className="bg-[var(--color-surface)]">
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الطلب
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              العميل
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              المنتج
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الإجمالي
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الحالة
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr
              key={o.id}
              className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]"
            >
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  #{o.order_number}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  {new Date(o.created_at).toLocaleDateString('ar-SA')}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {o.customer?.name ?? 'عميل'}
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {o.items && o.items.length ? o.items[0].name : '—'}
              </td>

              <td className="px-5 py-4 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
                {Number(o.total).toLocaleString('ar-SA')} ر.س
              </td>

              <td className="px-5 py-4">
                <OpStatusBadge status={o.status} />
              </td>

              <td className="px-5 py-4">
                <button
                  onClick={() => onOpen(o.id)}
                  aria-label="عرض تفاصيل الطلب"
                  title="عرض التفاصيل"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#45592D] transition hover:bg-[var(--color-accent-subtle)]"
                >
                  <Eye size={17} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
