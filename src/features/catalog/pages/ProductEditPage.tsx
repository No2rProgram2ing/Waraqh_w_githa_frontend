import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import {
  showErrorToast,
  showSuccessToast,
  showValidationErrorToast,
} from '@/lib/toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'

import { useProduct } from '../hooks/useProduct'
import {
  useUpdateProduct,
  type UpdateProductData,
} from '../hooks/useUpdateProduct'
import MediaUploader from '../components/media/MediaUploader'
import MediaGallery from '../components/media/MediaGallery'

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

  const updateProduct = useUpdateProduct()

  const [form, setForm] = useState<UpdateProductData>({
    name: '',
    sku: '',
    description: null,
    price: '',
    stock_quantity: 0,
    status: 'active',
    is_customizable: false,
    category_id: 0,
  })

  useEffect(() => {
    if (!product) {
      return
    }

    setForm({
      name: product.name ?? '',
      sku: product.sku ?? '',
      description: product.description ?? '',
      price: product.price ?? '',
      stock_quantity: product.stock_quantity,
      status: product.status,
      is_customizable: product.is_customizable,
      category_id: product.category?.id ?? 0,
    })
  }, [product])

  const handleChange = (
    field: keyof UpdateProductData,
    value: string | number | boolean | null,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    try {
      await updateProduct.mutateAsync({
        id,
        data: form,
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

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => void refetch()}
          >
            إعادة المحاولة
          </Button>

          <Link
            to="/admin/products"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            العودة للمنتجات
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
            تعديل المنتج
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            تعديل بيانات المنتج ووسائطه
          </p>
        </div>

        <Link
          to={`/admin/products/${id}`}
          className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          العودة للتفاصيل
        </Link>
      </div>

      <Card className="p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="product-name"
              label="اسم المنتج"
              type="text"
              value={form.name}
              onChange={(event) =>
                handleChange(
                  'name',
                  event.target.value,
                )
              }
            />

            <Input
              id="product-sku"
              label="SKU"
              type="text"
              value={form.sku}
              onChange={(event) =>
                handleChange(
                  'sku',
                  event.target.value,
                )
              }
            />

            <Input
              id="product-price"
              label="السعر (ريال يمني - الطبعة القديمة)"
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
              dir="ltr"
            />

            <Input
              id="product-stock"
              label="المخزون"
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={(event) =>
                handleChange(
                  'stock_quantity',
                  Number(event.target.value),
                )
              }
            />

            <div>
              <label
                htmlFor="product-status"
                className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                الحالة
              </label>

              <select
                id="product-status"
                value={form.status}
                onChange={(
                  event: ChangeEvent<HTMLSelectElement>,
                ) =>
                  handleChange(
                    'status',
                    event.target
                      .value as UpdateProductData['status'],
                  )
                }
                className="w-full rounded-[var(--radius-field)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-3.5 text-[15px] text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)] focus:bg-[var(--color-surface-card)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              >
                <option value="active">
                  نشط
                </option>

                <option value="inactive">
                  غير نشط
                </option>
              </select>
            </div>

            <Input
              id="product-category"
              label="رقم الفئة"
              type="number"
              min="1"
              value={form.category_id}
              onChange={(event) =>
                handleChange(
                  'category_id',
                  Number(event.target.value),
                )
              }
            />
          </div>

          <Textarea
            id="product-description"
            label="الوصف"
            rows={5}
            value={form.description ?? ''}
            onChange={(event) =>
              handleChange(
                'description',
                event.target.value || null,
              )
            }
          />

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
              className="h-4 w-4 accent-[var(--color-accent)]"
            />

            المنتج قابل للتخصيص
          </label>

          {updateProduct.isError && (
            <p className="rounded-xl border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
              تعذر تحديث المنتج. يرجى التحقق من البيانات والمحاولة مرة أخرى.
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={updateProduct.isPending}
              isLoading={updateProduct.isPending}
            >
              {updateProduct.isPending
                ? 'جاري الحفظ...'
                : 'حفظ التعديلات'}
            </Button>

            <Link
              to={`/admin/products/${id}`}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-5 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </Card>

      <section>
        <MediaUploader productId={id} />
        <MediaGallery productId={id} />
      </section>
    </div>
  )
}

export default ProductEditPage