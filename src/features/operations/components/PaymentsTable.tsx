import type { Payment } from '../types/payments.types'
import { format } from 'date-fns'
import { useState } from 'react'

function statusClass(status: Payment['status']) {
  switch (status) {
    case 'success':
      return 'bg-emerald-100 text-emerald-700'
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'failed':
      return 'bg-red-100 text-red-700'
    case 'refunded':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function PaymentsTable({ payments, onOpenDetails }: { payments: Payment[]; onOpenDetails: (id: number) => void }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <table className="w-full text-right">
        <thead>
          <tr className="text-sm text-[#6d6d6d]">
            <th className="p-3">رقم الطلب</th>
            <th>اسم العميل</th>
            <th>طريقة الدفع</th>
            <th>المبلغ</th>
            <th>الحالة</th>
            <th>تاريخ الدفع</th>
            <th>تفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3 text-sm font-semibold">{p.order_number}</td>
              <td className="p-3 text-sm">{p.customer_name}</td>
              <td className="p-3 text-sm">{p.method}</td>
              <td className="p-3 text-sm">{p.amount.toLocaleString('ar-SA')} ر.س</td>
              <td className="p-3 text-sm">
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${statusClass(p.status)}`}>{p.status}</span>
              </td>
              <td className="p-3 text-sm">{p.paid_at ? new Date(p.paid_at).toLocaleString('ar-SA') : '-'}</td>
              <td className="p-3 text-sm">
                <button onClick={() => onOpenDetails(p.id)} className="text-sm text-[#2563eb]">عرض</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
