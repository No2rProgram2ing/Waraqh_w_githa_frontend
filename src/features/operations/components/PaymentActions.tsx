import React, { useState } from 'react'
import { paymentsApi } from '../api/paymentsApi'

export function PaymentActions({ paymentId }: { paymentId: number }){
  const [loading, setLoading] = useState(false)

  const handleRefund = async () => {
    const ok = confirm('هل تريد بالتأكيد استرجاع المدفوعات لهذا الدفع؟')
    if (!ok) return
    const amountStr = prompt('أدخل المبلغ للاسترجاع (أترك فارغًا للمبلغ الكامل)')
    const amount = amountStr ? Number(amountStr) : undefined
    const reason = prompt('سبب الاسترجاع (اختياري)') || undefined
    setLoading(true)
    try {
      await paymentsApi.refund(paymentId, { amount, reason })
      alert('تمت معالجة الاسترجاع (محلي/سيرفر)')
    } catch (err) {
      console.error(err)
      alert('فشل معالجة الاسترجاع')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async () => {
    const ok = confirm('ضع علامة كمدفوع للدفع المحدد؟')
    if (!ok) return
    setLoading(true)
    try {
      await paymentsApi.markPaid(paymentId)
      alert('تم وضع علامة كمدفوع')
    } catch (err) {
      console.error(err)
      alert('فشل وضع العلامة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button disabled={loading} onClick={handleRefund} className="rounded-md bg-red-600 px-3 py-1 text-white text-sm">Refund</button>
      <button disabled={loading} onClick={handleMarkPaid} className="rounded-md bg-emerald-600 px-3 py-1 text-white text-sm">Mark as paid</button>
    </div>
  )
}
