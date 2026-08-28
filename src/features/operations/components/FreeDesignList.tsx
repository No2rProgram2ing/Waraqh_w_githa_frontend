import React from 'react'
import type { FreeDesignRequest } from '../types/freeDesign.types'

export function FreeDesignList({ items, onAssign }: { items: FreeDesignRequest[]; onAssign: (id: number) => void }){
  if (!items.length) return <div className="p-4">لا توجد طلبات تصميم حر حالياً.</div>

  return (
    <div className="rounded-2xl border bg-white p-4">
      <table className="w-full text-right">
        <thead>
          <tr className="text-sm text-[#6d6d6d]"><th className="p-3">العنوان</th><th>العميل</th><th>الحالة</th><th>إجراءات</th></tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-t">
              <td className="p-3 font-semibold">{it.title}</td>
              <td className="p-3">{it.customer_name ?? '-'}</td>
              <td className="p-3">{it.status}</td>
              <td className="p-3"><button onClick={() => onAssign(it.id)} className="text-[#2563eb]">تعيين</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
