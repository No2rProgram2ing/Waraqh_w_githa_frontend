import React from 'react'
import type { Payment } from '../types/payments.types'

interface Props {
  payment: Payment | null
  onClose: () => void
}

export function PaymentDetailsDrawer({ payment, onClose }: Props) {
  if (!payment) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-[420px] bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">تفاصيل الدفع</h3>
          <button onClick={onClose} className="text-sm">إغلاق</button>
        </div>

        <div className="mt-4 space-y-3 text-sm text-right">
          <div><strong>رقم الطلب:</strong> {payment.order_number}</div>
          <div><strong>العميل:</strong> {payment.customer_name}</div>
          <div><strong>طريقة الدفع:</strong> {payment.method}</div>
          <div><strong>المبلغ:</strong> {payment.amount.toLocaleString('ar-SA')} ر.س</div>
          <div><strong>الحالة:</strong> {payment.status}</div>
          <div><strong>تاريخ الدفع:</strong> {payment.paid_at ? new Date(payment.paid_at).toLocaleString('ar-SA') : '-'}</div>
          {payment.receipt_url && (
            <div>
              <strong>الإيصال:</strong>
              <div className="mt-2">
                <a href={payment.receipt_url} target="_blank" rel="noreferrer" className="text-sm text-[#2563eb]">عرض الإيصال</a>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
