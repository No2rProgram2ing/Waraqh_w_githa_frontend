import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { useSystemCurrency } from '@/lib/currency'
import {
  showErrorToast,
  showSuccessToast,
  showValidationErrorToast,
} from '@/lib/toast'

import { useCategories } from '../hooks/useCategories'
import { useCreateProduct } from '../hooks/useProducts'
import { useAttributes } from '../hooks/useAttributes'
import type { ProductAttribute } from '../types/product-attribute'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProductFormModal({
  isOpen,
  onClose,
}: ProductFormModalProps) {
  const { data: categories = [] } = useCategories()
  const { data: attributes = [], isLoading: isAttributesLoading } =
    useAttributes()

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
  const [attributeValues, setAttributeValues] = useState<
    Record<number, string>
  >({})
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setName('')
    setSku(`PRD-${Math.floor(1000 + Math.random() * 9000)}`)
    setCategoryId(categories.length > 0 ? categories[0].id : '')
    setPrice('')
    setStockQuantity('10')
    setStatus('active')
    setIsCustomizable(false)
    setDescription('')
    setAttributeValues({})
    setErrorMsg('')
  }, [isOpen, categories])

  const handleAttributeChange = (
    attributeId: number,
    value: string,
  ) => {
    setAttributeValues((current) => ({
      ...current,
      [attributeId]: value,
    }))
  }

  const getAttributeInput = (attribute: ProductAttribute) => {
    const value = attributeValues[attribute.id] ?? ''

    const commonClassName =
      'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)]'

    switch (attribute.input_type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(event) =>
              handleAttributeChange(
                attribute.id,
                event.target.value,
              )
            }
            className={commonClassName}
          >
            <option value="">اختر قيمة</option>

            {(attribute.options ?? []).map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        )

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(event) =>
              handleAttributeChange(
                attribute.id,
                event.target.value,
              )
            }
            className={commonClassName}
            placeholder={`أدخل ${attribute.display_name}`}
          />
        )

      case 'boolean':
        return (
          <select
            value={value}
            onChange={(event) =>
              handleAttributeChange(
                attribute.id,
                event.target.value,
              )
            }
            className={commonClassName}
          >
            <option value="">اختر</option>
            <option value="true">نعم</option>
            <option value="false">لا</option>
          </select>
        )

      case 'color':
      case 'text':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(event) =>
              handleAttributeChange(
                attribute.id,
                event.target.value,
              )
            }
            className={commonClassName}
            placeholder={`أدخل ${attribute.display_name}`}
          />
        )
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMsg('')

    if (!categoryId) {
      setErrorMsg('يرجى اختيار فئة للمنتج')
      return
    }

    const missingRequiredAttribute = attributes.find(
      (attribute) =>
        attribute.is_required &&
        !(attributeValues[attribute.id] ?? '').trim(),
    )

    if (missingRequiredAttribute) {
      setErrorMsg(
        `يرجى إدخال قيمة الخاصية المطلوبة: ${missingRequiredAttribute.display_name}`,
      )
      return
    }

    const attribute_values = attributes
      .filter((attribute) => {
        const value = attributeValues[attribute.id] ?? ''
        return value.trim() !== ''
      })
      .map((attribute) => ({
        attribute_id: attribute.id,
        value: attributeValues[attribute.id].trim(),
      }))

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
        attribute_values,
      },
      {
        onSuccess: () => {
          showSuccessToast('تمت إضافة المنتج بنجاح')
          onClose()
        },

        onError: (err: any) => {
          const validationErrors =
            err?.response?.data?.errors as
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

  if (!isOpen) {
    return null
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
                onChange={(event) => setName(event.target.value)}
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
                onChange={(event) => setSku(event.target.value)}
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
                onChange={(event) =>
                  setCategoryId(
                    event.target.value
                      ? Number(event.target.value)
                      : '',
                  )
                }
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
              >
                <option value="" disabled>
                  اختر الفئة
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
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
                onChange={(event) =>
                  setPrice(event.target.value)
                }
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
                onChange={(event) =>
                  setStockQuantity(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
                حالة المنتج
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | 'active'
                      | 'inactive',
                  )
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
              onChange={(event) =>
                setDescription(event.target.value)
              }
              className="w-full resize-none rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
              placeholder="وصف مختصر للمنتج..."
            />
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                خصائص المنتج
              </h3>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                اختر قيم الخصائص التي تنطبق على هذا المنتج. الخصائص
                التي تتركها فارغة لن يتم ربطها بالمنتج.
              </p>
            </div>

            {isAttributesLoading ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                جاري تحميل خصائص المنتجات...
              </p>
            ) : attributes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
                لا توجد خصائص معرفة حاليًا. يمكنك إضافة الخصائص من
                صفحة خصائص المنتجات.
              </div>
            ) : (
              <div className="space-y-4">
                {attributes.map((attribute) => (
                  <div key={attribute.id}>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                      {attribute.display_name}
                      {attribute.is_required ? (
                        <span className="mr-1 text-[var(--color-danger)]">
                          *
                        </span>
                      ) : null}
                    </label>

                    {getAttributeInput(attribute)}

                    {attribute.input_type === 'select' &&
                    !attribute.options?.length ? (
                      <p className="mt-1 text-xs text-[var(--color-danger)]">
                        لا توجد خيارات معرفة لهذه الخاصية.
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="modal-is-customizable"
              type="checkbox"
              checked={isCustomizable}
              onChange={(event) =>
                setIsCustomizable(event.target.checked)
              }
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
              disabled={isPending}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isPending || isAttributesLoading}
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
