import type { Payment } from '../types/payments.types'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'

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

export function PaymentDetailsDrawer({
  payment,
  onClose,
}: {
  payment: Payment | null
  onClose: () => void
}) {
  if (!payment) return null

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-details-title"
    >
      <button
        type="button"
        aria-label="إغلاق تفاصيل الدفع"
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-[2px]"
      />

      <aside className="flex h-full w-full max-w-[420px] flex-col border-s border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <h3
            id="payment-details-title"
            className="text-lg font-bold text-[var(--color-text-primary)]"
          >
            تفاصيل الدفع
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            إغلاق
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4 text-right text-sm">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                رقم الطلب
              </p>
              <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                {payment.order_number}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                العميل
              </p>
              <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                {payment.customer_name}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  طريقة الدفع
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {payment.method}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  المبلغ
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {payment.amount.toLocaleString('ar-SA')} ر.س
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  الحالة
                </p>
                <div className="mt-2">
                  <Badge variant={getPaymentStatusVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  تاريخ الدفع
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {payment.paid_at
                    ? new Date(payment.paid_at).toLocaleString('ar-SA')
                    : '—'}
                </p>
              </div>
            </div>

            {payment.receipt_url && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  الإيصال
                </p>

                <a
                  href={payment.receipt_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  عرض الإيصال
                </a>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}