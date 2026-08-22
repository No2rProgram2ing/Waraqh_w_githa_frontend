import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import {
  showErrorToast,
  showSuccessToast,
  showValidationErrorToast,
} from '@/lib/toast'

import { useProduct } from '../hooks/useProduct'
import { useCategories } from '../hooks/useCategories'
import {
  useUpdateProduct,
  type UpdateProductData,
} from '../hooks/useUpdateProduct'
import { useAttributes } from '../hooks/useAttributes'
import type { ProductAttribute } from '../types/product-attribute'

import MediaUploader from '../components/media/MediaUploader'
import MediaGallery from '../components/media/MediaGallery'

type ProductEditForm = Omit<
  UpdateProductData,
  'stock_quantity' | 'attribute_values'
> & {
  stock_quantity: string
}

function ProductEditPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(productId)

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProduct(id)

  const {
    data: categories,
    isLoading: isCategoriesLoading,
  } = useCategories()

  const {
    data: attributes = [],
    isLoading: isAttributesLoading,
  } = useAttributes()

  const updateProduct = useUpdateProduct()

  const [form, setForm] = useState<ProductEditForm>({
    name: '',
    sku: '',
    description: null,
    price: '',
    stock_quantity: '0',
    status: 'active',
    is_customizable: false,
    category_id: 0,
  })

  const [attributeValues, setAttributeValues] = useState<
    Record<number, string>
  >({})

  const [attributeError, setAttributeError] = useState('')

  useEffect(() => {
    if (!product) {
      return
    }

    setForm({
      name: product.name ?? '',
      sku: product.sku ?? '',
      description: product.description ?? '',
      price: product.price ?? '',
      stock_quantity: String(product.stock_quantity),
      status: product.status,
      is_customizable: product.is_customizable,
      category_id: product.category?.id ?? 0,
    })

    const currentValues: Record<number, string> = {}

    for (const attribute of product.attributes ?? []) {
      currentValues[attribute.id] = attribute.value ?? ''
    }

    setAttributeValues(currentValues)
    setAttributeError('')
  }, [product])

  const handleChange = (
    field: keyof ProductEditForm,
    value: string | number | boolean | null,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleAttributeChange = (
    attributeId: number,
    value: string,
  ) => {
    setAttributeValues((previous) => ({
      ...previous,
      [attributeId]: value,
    }))

    setAttributeError('')
  }

  const getAttributeInput = (attribute: ProductAttribute) => {
    const value = attributeValues[attribute.id] ?? ''

    const className =
      'mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]'

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
            className={className}
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
            className={className}
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
            className={className}
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
            className={className}
            placeholder={`أدخل ${attribute.display_name}`}
          />
        )
    }
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setAttributeError('')

    const missingRequiredAttribute = attributes.find(
      (attribute) =>
        attribute.is_required &&
        !(attributeValues[attribute.id] ?? '').trim(),
    )

    if (missingRequiredAttribute) {
      setAttributeError(
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
        value: (attributeValues[attribute.id] ?? '').trim(),
      }))

    try {
      await updateProduct.mutateAsync({
        id,
        data: {
          ...form,
          stock_quantity: Number(form.stock_quantity),
          attribute_values,
        },
      })

      showSuccessToast('تم تحديث المنتج بنجاح')

      await queryClient.invalidateQueries({
        queryKey: ['admin', 'product', id],
      })

      await queryClient.invalidateQueries({
        queryKey: ['admin', 'products'],
      })

      navigate(`/admin/products/${id}`)
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors as
        | Record<string, string[]>
        | undefined

      if (validationErrors) {
        showValidationErrorToast(validationErrors)
        return
      }

      showErrorToast(
        error?.response?.data?.message ||
          'فشل في تحديث المنتج، يرجى المحاولة مرة أخرى.',
      )
    }
  }

  if (isLoading) {
    return (
      <div dir="rtl" className="space-y-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
            تعديل المنتج
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            جاري تحميل بيانات المنتج...
          </p>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div dir="rtl" className="space-y-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
            تعذر تحميل المنتج
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            حدث خطأ أثناء تحميل بيانات المنتج.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
          >
            إعادة المحاولة
          </button>

          <Link
            to="/admin/products"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)]"
          >
            العودة للمنتجات
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
            تعديل المنتج
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            تعديل بيانات المنتج وخصائصه ووسائطه
          </p>
        </div>

        <Link
          to={`/admin/products/${id}`}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)]"
        >
          العودة للتفاصيل
        </Link>
      </div>

      <section className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="product-name"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
              >
                اسم المنتج
              </label>

              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange(
                    'name',
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
              />
            </div>

            <div>
              <label
                htmlFor="product-sku"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
              >
                SKU
              </label>

              <input
                id="product-sku"
                type="text"
                value={form.sku}
                onChange={(event) =>
                  handleChange(
                    'sku',
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
              />
            </div>

            <div>
              <label
                htmlFor="product-price"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
              >
                السعر (ريال يمني - الطبعة القديمة)
              </label>

              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(event) =>
                  handleChange(
                    'price',
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
              />
            </div>

            <div>
              <label
                htmlFor="product-stock"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
              >
                المخزون
              </label>

              <input
                id="product-stock"
                type="number"
                min="0"
                value={form.stock_quantity}
                onChange={(event) =>
                  handleChange(
                    'stock_quantity',
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
              />
            </div>

            <div>
              <label
                htmlFor="product-status"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
              >
                الحالة
              </label>

              <select
                id="product-status"
                value={form.status}
                onChange={(event) =>
                  handleChange(
                    'status',
                    event.target.value as UpdateProductData['status'],
                  )
                }
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
              >
                <option value="active">
                  نشط
                </option>

                <option value="inactive">
                  غير نشط
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
              >
                الفئة
              </label>

              <select
                id="product-category"
                value={form.category_id}
                onChange={(event) =>
                  handleChange(
                    'category_id',
                    Number(event.target.value),
                  )
                }
                disabled={isCategoriesLoading}
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value={0}>
                  {isCategoriesLoading
                    ? 'جاري تحميل الفئات...'
                    : 'اختر الفئة'}
                </option>

                {categories?.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="product-description"
              className="text-sm font-medium text-[var(--color-text-secondary)]"
            >
              الوصف
            </label>

            <textarea
              id="product-description"
              rows={5}
              value={form.description ?? ''}
              onChange={(event) =>
                handleChange(
                  'description',
                  event.target.value || null,
                )
              }
              className="mt-2 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-7 text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
            />
          </div>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="mb-4">
              <h2 className="font-bold text-[var(--color-text-primary)]">
                خصائص المنتج
              </h2>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                هذه هي الخصائص المعرفة في النظام. يمكنك تحديد القيم الخاصة بهذا المنتج وتعديلها في أي وقت.
              </p>
            </div>

            {isAttributesLoading ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                جاري تحميل خصائص المنتجات...
              </p>
            ) : attributes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
                لا توجد خصائص معرفة حاليًا.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {attributes.map((attribute) => (
                  <div key={attribute.id}>
                    <label
                      htmlFor={`product-attribute-${attribute.id}`}
                      className="text-sm font-medium text-[var(--color-text-secondary)]"
                    >
                      {attribute.display_name}

                      {attribute.is_required && (
                        <span className="mr-1 text-[var(--color-danger)]">
                          *
                        </span>
                      )}
                    </label>

                    <div
                      id={`product-attribute-${attribute.id}`}
                    >
                      {getAttributeInput(attribute)}
                    </div>

                    {attribute.input_type === 'select' &&
                      !attribute.options?.length && (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">
                          لا توجد خيارات معرفة لهذه الخاصية.
                        </p>
                      )}
                  </div>
                ))}
              </div>
            )}

            {attributeError && (
              <div className="mt-4 rounded-xl bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
                {attributeError}
              </div>
            )}
          </section>

          <label className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={form.is_customizable}
              onChange={(event) =>
                handleChange(
                  'is_customizable',
                  event.target.checked,
                )
              }
              className="h-4 w-4 accent-[#45592D]"
            />

            المنتج قابل للتخصيص
          </label>

          {updateProduct.isError && !attributeError && (
            <p className="rounded-xl bg-[#FDF0ED] px-4 py-3 text-sm text-[#A44938]">
              تعذر تحديث المنتج. يرجى التحقق من البيانات والمحاولة مرة أخرى.
            </p>
          )}

          <div className="flex items-center gap-3 border-t border-[#EBE1E7] pt-6">
            <button
              type="submit"
              disabled={
                updateProduct.isPending ||
                isAttributesLoading
              }
              className="rounded-xl bg-[#45592D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5D7243] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateProduct.isPending
                ? 'جاري الحفظ...'
                : 'حفظ التعديلات'}
            </button>

            <Link
              to={`/admin/products/${id}`}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-5 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)]"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </section>

      <section>
        <MediaUploader productId={id} />
        <MediaGallery productId={id} />
      </section>
    </div>
  )
}

export default ProductEditPage
