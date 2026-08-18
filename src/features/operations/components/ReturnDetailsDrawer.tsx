import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useReturn } from '../hooks/useReturns'

function getReturnStatusVariant(status: string): BadgeVariant {
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

export function ReturnDetailsDrawer({
  id,
  onClose,
}: {
  id: number | null
  onClose: () => void
}) {
  const { data: request } = useReturn(id ?? undefined)

  if (!id || !request) return null

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="return-details-title"
    >
      <button
        type="button"
        aria-label="إغلاق تفاصيل طلب الاستبدال"
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-[2px]"
      />

      <aside className="flex h-full w-full max-w-[560px] flex-col border-s border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <h3
            id="return-details-title"
            className="text-lg font-bold text-[var(--color-text-primary)]"
          >
            تفاصيل طلب استبدال — {request.order_number}
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
          <div className="space-y-5 text-right">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  العميل
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {request.customer_name ?? '—'}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  الحالة
                </p>

                <div className="mt-2">
                  <Badge variant={getReturnStatusVariant(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>
            </div>

            <section>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                السبب
              </h4>

              <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                {request.reason ?? '—'}
              </div>
            </section>

            <section>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                العناصر
              </h4>

              <div className="mt-3 space-y-2">
                {request.items && request.items.length ? (
                  request.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        {item.qty} ×{' '}
                        {item.price.toLocaleString('ar-SA')} ر.س
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--color-border-muted)] px-4 py-4 text-sm text-[var(--color-text-muted)]">
                    لا توجد عناصر
                  </div>
                )}
              </div>
            </section>

            <section>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                المرفقات
              </h4>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {request.attachments && request.attachments.length ? (
                  request.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    >
                      عرض المرفق {index + 1}
                    </a>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--color-border-muted)] px-4 py-4 text-sm text-[var(--color-text-muted)]">
                    لا توجد مرفقات
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Button
                type="button"
                onClick={() => alert('Approve (local fallback)')}
                fullWidth
              >
                موافقة
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => alert('Reject (local fallback)')}
                fullWidth
              >
                رفض
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
