import React, { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // نموذج بيانات الطلب الجديد
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    orderType: 'products', // منتجات أو خامات
    notes: '',
  })

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // قم باستبدال هذا المسار بالباك إند الخاص بك
      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'حدث خطأ أثناء إنشاء الطلب')
      }

      setFormData({ customerName: '', phone: '', orderType: 'products', notes: '' })
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'فشلت عملية إنشاء الطلب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" dir="rtl">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
        
        {/* هيدر النافذة */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-sm font-bold text-gray-800">إنشاء طلب جديد</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form إنشاء الطلب */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">اسم العميل *</label>
            <input
              type="text"
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleChange}
              placeholder="أدخل اسم العميل"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#45592D] focus:ring-1 focus:ring-[#45592D] focus:outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">رقم الهاتف *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="05xxxxxxxx"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#45592D] focus:ring-1 focus:ring-[#45592D] focus:outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">نوع الطلب</label>
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#45592D] focus:ring-1 focus:ring-[#45592D] focus:outline-none transition bg-white"
            >
              <option value="products">منتجات جاهزة</option>
              <option value="raw_materials">خامات ومواد أولية</option>
              <option value="custom">طلب تصنيع خاص</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">ملاحظات الطلب</label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="أدخل أي تفاصيل إضافية للطلب..."
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#45592D] focus:ring-1 focus:ring-[#45592D] focus:outline-none transition resize-none"
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#384824] transition disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              تأكيد وإنشاء الطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}