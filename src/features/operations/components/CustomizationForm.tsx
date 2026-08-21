import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { CustomizationImageUploader } from './CustomizationImageUploader'
import type { CustomizationOption } from '../types/customizations.types'

interface CustomizationFormProps {
  initialData?: CustomizationOption | null
  onClose: () => void
  onSuccess: () => void
}

export function CustomizationForm({ initialData, onClose, onSuccess }: CustomizationFormProps) {
  const data = initialData as any

  const [formData, setFormData] = useState({
    name: data?.name || '',
    type: data?.type || 'weaving',
    price_impact: data?.price_impact || 0,
    is_active: data?.is_active ?? true,
    description: data?.description || '',
    image_url: data?.image_url || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // هنا يتم استدعاء API الإنشاء أو التعديل
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving customization option:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100" dir="rtl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-800">
          {initialData ? 'تعديل خيار التخصيص' : 'إضافة خيار تخصيص جديد'}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* اسم خيار التخصيص */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            اسم الخيار / النمط
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: غزل روتان سداسي، خيزران طبيعي داكن"
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* نوع التخصيص وتكلفة التأثير */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              نوع التخصيص
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
            >
              <option value="weaving">نمط الحبك/الغزل</option>
              <option value="wood">نوع الخشب/الأساس</option>
              <option value="finish">الدهان والتلميع</option>
              <option value="fabric">الوسائد والقماش</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              تأثير السعر (ر.س)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price_impact}
              onChange={(e) => setFormData({ ...formData, price_impact: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* رفع صورة الخامة / النمط */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            صورة توضيحية للنمط/الخامة
          </label>
          <CustomizationImageUploader
            {...({
              value: formData.image_url ? [formData.image_url] : [],
              onChange: (files: any) => {
                const file = Array.isArray(files) ? files[0] : files
                if (file) {
                  const url = typeof file === 'string' ? file : URL.createObjectURL(file)
                  setFormData({ ...formData, image_url: url })
                } else {
                  setFormData({ ...formData, image_url: '' })
                }
              },
            } as any)}
          />
        </div>

        {/* الوصف / تفاصيل التخصيص */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            الوصف / تفاصيل التخصيص
          </label>
          <textarea
            rows={3}
            placeholder="اكتب وصفاً قصيراً يشرح خصائص النمط أو خامة الروتان..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-800 rounded-xl hover:bg-emerald-900 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            حفظ البيانات
          </button>
        </div>
      </form>
    </div>
  )
}