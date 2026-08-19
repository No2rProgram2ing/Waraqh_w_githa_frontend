import React from 'react'
import type { Order } from '../types/orders.types'
import { ProductionStageManager } from './ProductionStageManager'
import { OpStatusBadge } from './OpStatusBadge'
import { X } from 'lucide-react'

interface Props {
  order: Order | null
  onClose: () => void
}

export function OrderDetailsDrawer({ order, onClose }: Props) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-50 flex" dir="rtl">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="إغلاق"
      />

      {/* Drawer Panel */}
      <aside className="flex w-full max-w-[520px] flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              تفاصيل الطلب
            </h3>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              #{order.order_number}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Summary Row */}
          <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="flex-1 space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">العميل</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {order.customer?.name ?? '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">المجموع</span>
                <span className="font-bold tabular-nums text-[var(--color-text-primary)]">
                  {Number(order.total).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-muted)]">الحالة</span>
                <OpStatusBadge status={order.status} />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
              عناصر الطلب
            </h4>
            {order.items && order.items.length ? (
              <ul className="space-y-2">
                {order.items.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {it.name}
                    </span>
                    <span className="tabular-nums text-[var(--color-text-muted)]">
                      {it.qty} × {Number(it.price).toLocaleString('ar-SA')} ر.س
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">لا توجد عناصر</p>
            )}
          </div>

          {/* Production Stages */}
          <div className="border-t border-[var(--color-border)] pt-5">
            <h4 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
              مراحل الإنتاج
            </h4>
            <ProductionStageManager orderId={order.id} />
          </div>
        </div>
      </aside>
    </div>
  )
}
