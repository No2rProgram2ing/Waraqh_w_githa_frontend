import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getCurrencyLabel, useSystemCurrency } from '@/lib/currency'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import { useCategories } from '../hooks/useCategories'
import { useCreateProduct } from '../hooks/useProducts'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProductFormModal({
  isOpen,
  onClose,
}: ProductFormModalProps) {
  const { data: categories = [] } = useCategories()
  const { mutate: createProduct, isPending } = useCreateProduct()
  const { currencyCode } = useSystemCurrency()

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [price, setPrice] = useState<string>('')
  const [stockQuantity, setStockQuantity] = useState<number>(0)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [isCustomizable, setIsCustomizable] = useState(false)
  const [description, setDescription] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName('')
      setSku(`PRD-${Math.floor(1000 + Math.random() * 9000)}`)
      setCategoryId(categories.length > 0 ? categories[0].id : '')
      setPrice('')
      setStockQuantity(10)
      setStatus('active')
      setIsCustomizable(false)
      setDescription('')
      setErrorMsg('')
    }
  }, [isOpen, categories])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!categoryId) {
      setErrorMsg('يرجى اختيار فئة للمنتج')
      return
    }

    createProduct(
      {
        name,
        sku,
        category_id: Number(categoryId),
        price: parseFloat(price) || 0,
        stock_quantity: Number(stockQuantity),
        status,
        is_customizable: isCustomizable,
        description: description || null,
      },
      {
        onSuccess: () => {
          showSuccessToast('تمت إضافة المنتج بنجاح')
          onClose()
        },
        onError: (err: any) => {
          const validationErrors = err?.response?.data?.errors as Record<string, string[]> | undefined
          if (validationErrors) {
            showValidationErrorToast(validationErrors)
            return
          }

          const msg =
            err?.response?.data?.message ||
            'حدث خطأ أثناء إضافة المنتج. يرجى التأكد من البيانات.'
          setErrorMsg(msg)
          showErrorToast(msg)
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-lg overflow-hidden shadow-xl"
        dir="rtl"
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            إضافة منتج جديد
          </h2>

          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="rounded-xl bg-[#FDF0ED] px-4 py-3 text-sm text-[#A44938]">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                اسم المنتج *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                placeholder="أدخل اسم المنتج"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                رمز المنتج (SKU) *
              </label>
              <input
                required
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                placeholder="مثال: PRD-1001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                الفئة *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
              >
                <option value="" disabled>
                  اختر الفئة
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                السعر (ريال يمني - الطبعة القديمة) 
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                الكمية المتوفرة *
              </label>
              <input
                required
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                حالة المنتج
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              الوصف (اختياري)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors resize-none"
              placeholder="وصف مختصر للمنتج..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="modal-is-customizable"
              type="checkbox"
              checked={isCustomizable}
              onChange={(e) => setIsCustomizable(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-border)] text-[#45592D] focus:ring-[#45592D]"
            />
            <label
              htmlFor="modal-is-customizable"
              className="text-sm font-medium text-[var(--color-text-secondary)]"
            >
              المنتج قابل للتخصيص
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl bg-[#45592D] text-white text-sm font-semibold hover:bg-[#5D7243] transition-colors disabled:opacity-50"
            >
              {isPending ? 'جاري الإضافة...' : 'حفظ المنتج'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
