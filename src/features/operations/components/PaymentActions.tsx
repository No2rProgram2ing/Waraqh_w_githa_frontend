import { useUpdatePaymentStatus } from '../hooks/usePayments'
import type { PaymentStatus } from '../types/payments.types'
import { OpButton } from './OpButton'

export function PaymentActions({ paymentId, status }: { paymentId: number; status: string }) {
  const update = useUpdatePaymentStatus()

  const change = (next: PaymentStatus) => {
    const admin_note = window.prompt('ملاحظة الإدارة (اختياري):') ?? undefined
    update.mutate({ id: paymentId, status: next, admin_note })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4">
      {status !== 'paid' && <OpButton size="sm" variant="primary" disabled={update.isPending} onClick={() => change('paid')}>تعيين كمدفوع</OpButton>}
      {status !== 'unpaid' && <OpButton size="sm" disabled={update.isPending} onClick={() => change('unpaid')}>تعيين غير مدفوع</OpButton>}
      {status !== 'failed' && <OpButton size="sm" variant="danger" disabled={update.isPending} onClick={() => change('failed')}>تعيين فشل</OpButton>}
    </div>
  )
}
