import React from 'react'
import type { Order } from '../types/orders.types'

interface Props {
  order: Order | null
  onClose: () => void
}

export function OrderDetailsDrawer({ order, onClose }: Props) {
  const [localStages, setLocalStages] = React.useState<Order['production_stages'] | null>(order?.production_stages ?? null)

  React.useEffect(() => {
    if (!order) return
    // Load any locally saved stage updates for this order
    try {
      const key = `order_stages_${order.id}`
      const raw = localStorage.getItem(key)
      if (raw) {
        setLocalStages(JSON.parse(raw))
      } else {
        setLocalStages(order.production_stages ?? null)
      }
    } catch (err) {
      setLocalStages(order.production_stages ?? null)
    }
  }, [order])

  const updateStage = (key: string, status: string) => {
    if (!localStages) return
    const updated = localStages.map((s) => (s.key === key ? { ...s, status, date: new Date().toISOString() } : s))
    setLocalStages(updated)
    try {
      const storageKey = `order_stages_${order?.id}`
      localStorage.setItem(storageKey!, JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to save stages locally', err)
    }
  }

  if (!order) return null

  const stages = localStages ?? order.production_stages ?? []

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
            <div className="mt-2 space-y-2">
              {stages && stages.length ? (
                stages.map((s) => (
                  <div key={s.key} className="flex items-center justify-between">
                    <div className="text-sm">{s.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm"><span className={`inline-block px-2 py-1 rounded-full text-xs ${s.status === 'done' ? 'bg-emerald-100 text-emerald-700' : s.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : s.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{s.status}</span></div>
                      {s.status !== 'done' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateStage(s.key, 'in_progress')} className="rounded-md border px-2 py-1 text-xs">تشغيل</button>
                          <button onClick={() => updateStage(s.key, 'done')} className="rounded-md bg-emerald-600 px-2 py-1 text-xs text-white">إنهاء</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div>لا توجد معلومات مراحل</div>
              )}
            </div>
          </div>

        </div>

      </aside>
    </div>
  )
}
