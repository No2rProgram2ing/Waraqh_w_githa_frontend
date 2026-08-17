import React from 'react'
import type { Order } from '../types/orders.types'
import { ProductionStageManager } from './ProductionStageManager'

interface Props {
  order: Order | null
  onClose: () => void
}

export function OrderDetailsDrawer({ order, onClose }: Props) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-[520px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">تفاصيل الطلب — {order.order_number}</h3>
          <button onClick={onClose} className="text-sm">إغلاق</button>
        </div>

        <div className="mt-4 text-sm text-right space-y-3">
          <div><strong>العميل:</strong> {order.customer?.name ?? '-'}</div>
          <div><strong>المجموع:</strong> {order.total.toLocaleString('ar-SA')} ر.س</div>
          <div><strong>الحالة:</strong> {order.status}</div>

          <div>
            <strong>العناصر:</strong>
            <ul className="mt-2 space-y-2">
              {order.items && order.items.length ? (
                order.items.map((it) => (
                  <li key={it.id} className="text-sm">{it.name} — {it.qty} × {it.price.toLocaleString('ar-SA')} ر.س</li>
                ))
              ) : (
                <li>لا توجد عناصر</li>
              )}
            </ul>
          </div>

          <div>
            <strong>مراحل الإنتاج:</strong>
            <div className="mt-2">
              <ProductionStageManager orderId={order.id} />
            </div>
          </div>

        </div>

      </aside>
    </div>
  )
}
