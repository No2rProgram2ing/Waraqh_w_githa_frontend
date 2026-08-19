import type { Payment } from '../types/payments.types'
import { OpStatusBadge } from './OpStatusBadge'
import { Eye } from 'lucide-react'

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  success:  'ناجح',
  pending:  'قيد الانتظار',
  failed:   'فشل',
  refunded: 'مُستردّ',
  paid:     'مدفوع',
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  card:          'بطاقة بنكية',
  bank_transfer: 'تحويل بنكي',
  cash:          'نقداً',
  online:        'دفع إلكتروني',
}

/* ─── Toolbar ───────────────────────────────────────────────── */
interface PaymentsToolbarProps {
  search: string
  onSearchChange: (v: string) => void
}

export function PaymentsToolbar({ search, onSearchChange }: PaymentsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
      <div>
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">قائمة المدفوعات</h2>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">جميع المعاملات المالية المسجّلة في النظام</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          id="payments-search-input"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="البحث عن مدفوعة..."
          className="w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] sm:w-64"
          aria-label="البحث عن مدفوعة"
        />
      </div>
    </div>
  )
}

/* ─── Table ─────────────────────────────────────────────────── */
interface PaymentsTableProps {
  payments: Payment[]
  onOpenDetails: (id: number) => void
  isLoading?: boolean
  searchTerm?: string
}

export function PaymentsTable({
  payments,
  onOpenDetails,
  isLoading = false,
  searchTerm = '',
}: PaymentsTableProps) {
  const filtered = searchTerm
    ? payments.filter(
        (p) =>
          p.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : payments

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">جارٍ تحميل المدفوعات...</p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          {searchTerm ? 'لا توجد نتائج مطابقة للبحث.' : 'لا توجد مدفوعات لعرضها.'}
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
              رقم الطلب
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              العميل
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              طريقة الدفع
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              المبلغ
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الحالة
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              تاريخ الدفع
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr
              key={p.id}
              className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]"
            >
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  #{p.order_number}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {p.customer_name}
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {PAYMENT_METHOD_LABEL[p.method] ?? p.method}
              </td>

              <td className="px-5 py-4 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
                {Number(p.amount).toLocaleString('ar-SA')} ر.س
              </td>

              <td className="px-5 py-4">
                <OpStatusBadge
                  status={p.status}
                  label={PAYMENT_STATUS_LABEL[p.status]}
                />
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {p.paid_at
                  ? new Date(p.paid_at).toLocaleDateString('ar-SA')
                  : '—'}
              </td>

              <td className="px-5 py-4">
                <button
                  onClick={() => onOpenDetails(p.id)}
                  aria-label="عرض تفاصيل الدفع"
                  title="عرض التفاصيل"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-accent)] transition hover:bg-[var(--color-accent-subtle)]"
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
