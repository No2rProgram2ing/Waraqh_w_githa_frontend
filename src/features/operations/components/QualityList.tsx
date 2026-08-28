import React from 'react'
import type { QualityReview } from '../types/quality.types'

export function QualityList({ reviews, onOpen }: { reviews: QualityReview[]; onOpen: (id: number) => void }){
  if (!reviews.length) return <div className="p-4">لا توجد طلبات مراجعة جودة حالياً.</div>

  return (
    <div className="rounded-2xl border bg-white p-4">
      <table className="w-full text-right">
        <thead>
          <tr className="text-sm text-[#6d6d6d]">
            <th className="p-3">رقم الطلب</th>
            <th>المنتج</th>
            <th>العميل</th>
            <th>الحالة</th>
            <th>الصور</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3 font-semibold">{r.order_number}</td>
              <td className="p-3">{r.product_name ?? '—'}</td>
              <td className="p-3">{r.customer_name ?? '—'}</td>
              <td className="p-3 text-sm">{r.status}</td>
              <td className="p-3">
                {r.images && r.images.length ? <img src={r.images[0].url} className="h-12 w-12 object-cover rounded" alt="thumb" /> : '—'}
              </td>
              <td className="p-3"><button onClick={() => onOpen(r.id)} className="text-[#2563eb]">عرض</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
