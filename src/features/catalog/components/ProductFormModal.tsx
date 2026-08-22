import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useSystemCurrency } from '@/lib/currency'
import {
  showErrorToast,
  showSuccessToast,
  showValidationErrorToast,
} from '@/lib/toast'
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
  useSystemCurrency()

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [price, setPrice] = useState<string>('')
  const [stockQuantity, setStockQuantity] = useState<string>('0')
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
      setStockQuantity('10')
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
          const validationErrors = err?.response?.data?.errors as
            | Record<string, string[]>
            | undefined

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-[var(--color-surface-card)] shadow-xl"
        dir="rtl"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            إضافة منتج جديد
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] space-y-4 overflow-y-auto p-5"
        >
          {errorMsg && (
            <div className="rounded-xl bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
                اسم المنتج *
              </label>

              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
                placeholder="أدخل اسم المنتج"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
                رمز المنتج (SKU) *
              </label>

              <input
                required
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
                placeholder="مثال: PRD-1001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
                الفئة *
              </label>

              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
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
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
                السعر (ريال يمني - الطبعة القديمة)
              </label>

              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
                الكمية المتوفرة *
              </label>

              <input
                required
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
                حالة المنتج
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'active' | 'inactive')
                }
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
              الوصف (اختياري)
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
              placeholder="وصف مختصر للمنتج..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="modal-is-customizable"
              type="checkbox"
              checked={isCustomizable}
              onChange={(e) => setIsCustomizable(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />

            <label
              htmlFor="modal-is-customizable"
              className="text-sm font-medium text-[var(--color-text-secondary)]"
            >
              المنتج قابل للتخصيص
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'جاري الإضافة...' : 'حفظ المنتج'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}