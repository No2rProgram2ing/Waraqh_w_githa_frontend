import type { Order } from '../types/orders.types'
import { ProductionStageManager } from './ProductionStageManager'

interface Props {
  order: Order | null
  onClose: () => void
}

export function OrderDetailsDrawer({ order, onClose }: Props) {
  if (!order) return null

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
    >
      <button
        type="button"
        aria-label="إغلاق تفاصيل الطلب"
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-[2px]"
      />

      <aside className="flex h-full w-full max-w-[520px] flex-col border-s border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <h3
            id="order-details-title"
            className="text-lg font-bold text-[var(--color-text-primary)]"
          >
            تفاصيل الطلب — {order.order_number}
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
          <div className="space-y-5 text-right text-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  العميل
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {order.customer?.name ?? '—'}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  المجموع
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {order.total.toLocaleString('ar-SA')} ر.س
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4 sm:col-span-2">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  الحالة
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {order.status}
                </p>
              </div>
            </div>

            <section>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                العناصر
              </h4>

              <div className="mt-3 space-y-2">
                {order.items && order.items.length ? (
                  order.items.map((item) => (
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
                مراحل الإنتاج
              </h4>

              <div className="mt-3">
                <ProductionStageManager orderId={order.id} />
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  )
}
