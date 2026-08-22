import { useMemo, useState } from 'react'
import type { Order } from '../types/orders.types'
import { OpSearch } from './OpSearch'
import { OpStatusBadge } from './OpStatusBadge'
import { useSystemCurrency } from '@/lib/currency'

interface LatestOrdersProps {
  orders?: Order[]
}

export function LatestOrders({ orders = [] }: LatestOrdersProps) {
  const { formatAmount } = useSystemCurrency()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesSearch = !q || [order.order_number, order.customer?.name, order.product?.name].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      return matchesSearch && (!status || String(order.status) === status)
    })
  }, [orders, search, status])

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">لا توجد طلبات حديثة</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:flex-row sm:items-center">
        <OpSearch value={search} onChange={setSearch} placeholder="ابحث في الطلبات الحديثة..." className="w-full sm:max-w-[300px]" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]" aria-label="فلترة الطلبات الحديثة">
          <option value="">جميع الحالات</option><option value="received">مُستلم</option><option value="in_production">قيد التصنيع</option><option value="in_transit">قيد التوصيل</option><option value="cancelled">ملغي</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? <div className="px-5 py-10 text-center text-sm text-[var(--color-text-muted)]">لا توجد نتائج مطابقة.</div> : <div className="overflow-x-auto">
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
          {filteredOrders.map((order) => (
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
      </div>}
    </div>
  )
}