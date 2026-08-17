import React from 'react'
import type { ReturnRequest } from '../types/returns.types'

export function ReturnsTable({ returnsList, onOpen }: { returnsList: ReturnRequest[]; onOpen: (id: number) => void }){
  if (!returnsList.length) return <div className="p-4">لا توجد طلبات استبدال حالياً.</div>

  return (
    <div className="rounded-2xl border bg-white p-4">
      <table className="w-full text-right">
        <thead>
          <tr className="text-sm text-[#6d6d6d]">
            <th className="p-3">رقم الطلب</th>
            <th>العميل</th>
            <th>الحالة</th>
            <th>السبب</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {returnsList.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3 font-semibold">{r.order_number ?? '-'}</td>
              <td className="p-3">{r.customer_name ?? '-'}</td>
              <td className="p-3">{r.status}</td>
              <td className="p-3">{r.reason ?? '-'}</td>
              <td className="p-3"><button onClick={() => onOpen(r.id!)} className="text-[#2563eb]">عرض</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
