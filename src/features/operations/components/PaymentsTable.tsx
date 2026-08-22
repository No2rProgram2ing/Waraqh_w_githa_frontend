import type { Payment } from '../types/payments.types'
import { OpStatusBadge } from './OpStatusBadge'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { OpIconButton } from './OpIconButton'

const PAYMENT_STATUS_LABEL: Record<string, string> = { paid: 'مدفوع', unpaid: 'غير مدفوع', failed: 'فشل' }
const PAYMENT_METHOD_LABEL: Record<string, string> = { jawali: 'جوالي', jeeb: 'جيب', al_kuraimi: 'الكريمي' }

interface PaymentsTableProps {
  payments: Payment[]
  onOpenDetails: (id: number) => void
  onDelete?: (id: number) => void
  isLoading?: boolean
  searchTerm?: string
  status?: string
  method?: string
}

export function PaymentsTable({ payments, onOpenDetails, onDelete, isLoading = false, searchTerm = '', status = '', method = '' }: PaymentsTableProps) {
  const query = searchTerm.trim().toLowerCase()
  const filtered = payments.filter((p) => {
    const matchesSearch = !query || [p.order_number, p.customer_name, p.method, PAYMENT_METHOD_LABEL[p.method], String(p.amount)]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(query))
    return matchesSearch && (!status || p.status === status) && (!method || p.method === method)
  })

  if (isLoading) return <div className="px-5 py-16 text-center text-sm text-[var(--color-text-muted)]">جارٍ تحميل المدفوعات...</div>
  if (!filtered.length) return <div className="px-5 py-16 text-center text-sm font-medium text-[var(--color-text-muted)]">لا توجد نتائج مطابقة.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] text-right">
        <thead className="bg-[var(--color-surface-subtle)]">
          <tr className="border-b border-[var(--color-border)]">
            {['رقم الطلب', 'العميل', 'طريقة الدفع', 'المبلغ', 'الحالة', 'تاريخ الدفع', 'الإجراءات'].map((head) => (
              <th key={head} className="px-5 py-3.5 text-xs font-semibold text-[var(--color-text-muted)]">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]">
              <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text-primary)]">#{p.order_number}</td>
              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{p.customer_name}</td>
              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{PAYMENT_METHOD_LABEL[p.method] ?? p.method}</td>
              <td className="px-5 py-4 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">{Number(p.amount).toLocaleString('ar-SA')} ر.س</td>
              <td className="px-5 py-4"><OpStatusBadge status={p.status} label={PAYMENT_STATUS_LABEL[p.status]} /></td>
              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('ar-SA') : '—'}</td>
              <td className="px-5 py-4"><div className="flex items-center gap-1"><OpIconButton icon={<Eye size={17} strokeWidth={1.8} />} label="عرض تفاصيل الدفع" onClick={() => onOpenDetails(p.id)} /><OpIconButton icon={<Pencil size={17} strokeWidth={1.8} />} label="تعديل الدفع" onClick={() => onOpenDetails(p.id)} /><OpIconButton icon={<Trash2 size={17} strokeWidth={1.8} />} label="حذف الدفع" tone="danger" onClick={() => onDelete?.(p.id)} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
