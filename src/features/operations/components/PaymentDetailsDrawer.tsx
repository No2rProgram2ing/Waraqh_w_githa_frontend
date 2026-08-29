import { X } from 'lucide-react'
import type { Payment } from '../types/payments.types'
import { OpButton } from './OpButton'
import { OpStatusBadge } from './OpStatusBadge'
import { useSystemCurrency } from '@/lib/currency'
import { PaymentActions } from './PaymentActions'

interface Props { payment: Payment | null; onClose: () => void }
const METHOD_LABEL: Record<string, string> = { jawali: 'جوالي', jeeb: 'جيب', al_kuraimi: 'الكريمي' }

export function PaymentDetailsDrawer({ payment, onClose }: Props) {
  const { formatAmount } = useSystemCurrency()

  if (!payment) return null

  return (
    <div className="fixed inset-0 z-50 flex" dir="rtl">
      <button className="flex-1 bg-black/40" onClick={onClose} aria-label="إغلاق" />
      <aside className="w-full max-w-[460px] overflow-auto border-r border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">تفاصيل الدفع</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">معلومات المعاملة والإجراء المتاح</p>
          </div>
          <OpButton variant="ghost" size="sm" onClick={onClose} aria-label="إغلاق" icon={<X className="h-4 w-4" />}>إغلاق</OpButton>
        </div>

        <div className="mt-5 space-y-4 text-sm">
          <div className="flex justify-between gap-3"><strong>رقم الطلب</strong><span>#{payment.order_number}</span></div>
          <div className="flex justify-between gap-3"><strong>العميل</strong><span>{payment.customer_name}</span></div>
          <div className="flex justify-between gap-3"><strong>طريقة الدفع</strong><span>{METHOD_LABEL[payment.method] ?? payment.method}</span></div>
          <div className="flex justify-between gap-3"><strong>المبلغ</strong><b>{formatAmount(payment.amount)}</b></div>
          <div className="flex items-center justify-between gap-3"><strong>الحالة</strong><OpStatusBadge status={String(payment.status)} /></div>
          <div className="flex justify-between gap-3"><strong>التاريخ</strong><span>{payment.created_at ? new Date(payment.created_at).toLocaleString('ar-SA') : '-'}</span></div>
          <PaymentActions paymentId={payment.id} status={String(payment.status)} />
        </div>
      </aside>
    </div>
  )
}
