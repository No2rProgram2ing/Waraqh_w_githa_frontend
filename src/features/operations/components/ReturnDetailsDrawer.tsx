import React from 'react'
import type { ReturnRequest } from '../types/returns.types'
import { useReturn } from '../hooks/useReturns'

export function ReturnDetailsDrawer({ id, onClose }: { id: number | null; onClose: () => void }){
  const { data } = useReturn(id ?? undefined)
  const r = data?.data ?? null

  if (!id) return null
  if (!r) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-[560px] bg-white p-6 shadow-xl overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">تفاصيل طلب استبدال — {r.order_number}</h3>
          <button onClick={onClose} className="text-sm">إغلاق</button>
        </div>

        <div className="mt-4 space-y-3 text-right">
          <div><strong>العميل:</strong> {r.customer_name ?? '-'}</div>
          <div><strong>الحالة:</strong> {r.status}</div>
          <div><strong>السبب:</strong> {r.reason}</div>

          <div>
            <strong>العناصر:</strong>
            <ul className="mt-2 space-y-2">
              {r.items && r.items.length ? r.items.map((it) => (<li key={it.id}>{it.name} — {it.qty} × {it.price.toLocaleString('ar-SA')} ر.س</li>)) : <li>لا توجد عناصر</li>}
            </ul>
          </div>

          <div>
            <strong>المرفقات:</strong>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {r.attachments && r.attachments.length ? r.attachments.map((a, i) => (<a key={i} href={a} target="_blank" rel="noreferrer" className="text-blue-600">عرض المرفق {i+1}</a>)) : <div>لا توجد مرفقات</div>}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => alert('Approve (local fallback)')} className="rounded-md bg-emerald-600 px-4 py-2 text-white">موافقة</button>
            <button onClick={() => alert('Reject (local fallback)')} className="rounded-md bg-red-600 px-4 py-2 text-white">رفض</button>
          </div>
        </div>
      </aside>
    </div>
  )
}
