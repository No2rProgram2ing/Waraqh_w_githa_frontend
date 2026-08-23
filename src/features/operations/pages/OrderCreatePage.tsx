import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { axiosAdminClient } from '@/api/axiosAdminClient'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { useSystemCurrency } from '@/lib/currency'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

import { OpButton } from '../components/OpButton'
import { OpCard } from '../components/OpCard'
import { OpPageHeader } from '../components/OpPageHeader'
import { useCreateOrder } from '../hooks/useOrders'

import type { OrderType } from '../types/orders.types'

interface CustomerOption {
  id: number
  full_name: string
  phone: string | null
}

interface ProductOption {
  id: number
  name: string
  sku: string | null
  price: number
  stock_quantity: number
  reserved_quantity: number
  is_customizable: boolean
}

function unwrapCollection(payload: unknown): unknown[] {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload
  ) {
    const outerData = (payload as { data?: unknown }).data

    if (
      outerData &&
      typeof outerData === 'object' &&
      'data' in outerData
    ) {
      const innerData = (outerData as { data?: unknown }).data

      return Array.isArray(innerData) ? innerData : []
    }

    return Array.isArray(outerData) ? outerData : []
  }

  return []
}

function getApiErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'تعذر إنشاء الطلب. حاول مرة أخرى.'
  }

  const response = (
    error as {
      response?: {
        data?: {
          message?: unknown
          errors?: Record<string, unknown>
        }
      }
    }
  ).response?.data

  if (
    typeof response?.message === 'string' &&
    response.message.trim()
  ) {
    return response.message
  }

  if (
    response?.errors &&
    typeof response.errors === 'object'
  ) {
    const messages = Object.values(response.errors)
      .flatMap((value) =>
        Array.isArray(value) ? value : [value],
      )
      .filter(
        (value): value is string =>
          typeof value === 'string',
      )

    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  return 'تعذر إنشاء الطلب. حاول مرة أخرى.'
}

export default function OrderCreatePage() {
  const navigate = useNavigate()
  const { formatAmount } = useSystemCurrency()
  const createOrder = useCreateOrder()

  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [customerId, setCustomerId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [orderType, setOrderType] =
    useState<OrderType>('ready_made')
  const [shippingFee, setShippingFee] = useState('0')
  const [expectedDeliveryDate, setExpectedDeliveryDate] =
    useState('')
  const [customizationNote, setCustomizationNote] =
    useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        setLoadingData(true)
        setLoadError('')

        const [customersResponse, productsResponse] =
          await Promise.all([
            axiosAdminClient.get('/admin/customers', {
              params: { per_page: 100 },
            }),
            axiosAdminClient.get('/admin/products', {
              params: { per_page: 100 },
            }),
          ])

        if (!mounted) return

        const customersData = unwrapCollection(
          customersResponse.data,
        )

        const productsData = unwrapCollection(
          productsResponse.data,
        )

        setCustomers(
          customersData
            .map((customer: unknown) => {
              const item = customer as {
                id?: unknown
                full_name?: unknown
                name?: unknown
                phone?: unknown
              }

              return {
                id: Number(item.id),
                full_name: String(
                  item.full_name ??
                    item.name ??
                    '',
                ),
                phone:
                  typeof item.phone === 'string'
                    ? item.phone
                    : null,
              }
            })
            .filter(
              (customer) =>
                customer.id > 0 &&
                customer.full_name,
            ),
        )

        setProducts(
          productsData
            .map((product: unknown) => {
              const item = product as {
                id?: unknown
                name?: unknown
                sku?: unknown
                price?: unknown
                stock_quantity?: unknown
                reserved_quantity?: unknown
                is_customizable?: unknown
              }

              return {
                id: Number(item.id),
                name: String(item.name ?? ''),
                sku:
                  typeof item.sku === 'string'
                    ? item.sku
                    : null,
                price: Number(item.price ?? 0),
                stock_quantity: Number(
                  item.stock_quantity ?? 0,
                ),
                reserved_quantity: Number(
                  item.reserved_quantity ?? 0,
                ),
                is_customizable: Boolean(
                  item.is_customizable,
                ),
              }
            })
            .filter(
              (product) =>
                product.id > 0 &&
                product.name,
            ),
        )
      } catch (err) {
        console.error(
          'OrderCreatePage load error:',
          err,
        )

        if (mounted) {
          setLoadError(
            'تعذر تحميل العملاء والمنتجات. تأكد من تسجيل دخول الإدارة واتصال الخادم.',
          )
        }
      } finally {
        if (mounted) {
          setLoadingData(false)
        }
      }
    }

    void loadData()

    return () => {
      mounted = false
    }
  }, [])

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) =>
          product.id === Number(productId),
      ) ?? null,
    [products, productId],
  )

  const availableStock = selectedProduct
    ? Math.max(
        0,
        selectedProduct.stock_quantity -
          selectedProduct.reserved_quantity,
      )
    : 0

  const numericQuantity =
    Number(quantity) || 0

  const numericShipping = Math.max(
    0,
    Number(shippingFee) || 0,
  )

  const subtotal =
    selectedProduct && numericQuantity > 0
      ? selectedProduct.price *
        numericQuantity
      : 0

  const total =
    subtotal + numericShipping


  const valid =
    Number(customerId) > 0 &&
    Number(productId) > 0 &&
    Number.isInteger(numericQuantity) &&
    numericQuantity > 0 &&
    numericQuantity <= availableStock &&
    (
        !customizationNote.trim() ||
        Boolean(selectedProduct?.is_customizable)
      )
  const save = () => {
    setError('')

    if (!valid) {
      setError(
        'يرجى التأكد من اختيار العميل والمنتج والكمية المتاحة وبيانات التخصيص.',
      )
      return
    }

    createOrder.mutate(
      {
        customer_id: Number(customerId),
        order_type: orderType,
        expected_delivery_date:
          expectedDeliveryDate || null,
        shipping_fee: numericShipping,
        items: [
          {
            product_id: Number(productId),
            quantity: numericQuantity,
            customization_note: 
              selectedProduct?.is_customizable
                ? customizationNote.trim() || null
                : null,
          },
        ],
      },
      {
        onSuccess: (order) => {
          showSuccessToast(
            'تم إنشاء الطلب بنجاح',
          )

          navigate(
            `/admin/orders/${order.id}`,
            { replace: true },
          )
        },

        onError: (err) => {
          console.error(
            'OrderCreatePage create error:',
            err,
          )

          const message =
            getApiErrorMessage(err)

          showErrorToast(message)
          setError(message)
        },
      },
    )
  }

  return (
    <div
      dir="rtl"
      className="space-y-6"
    >
      <Helmet>
        <title>
          إضافة طلب جديد — لوحة الإدارة
        </title>
      </Helmet>

      <OpPageHeader
        title="إضافة طلب جديد"
        description="إنشاء طلب جديد من لوحة إدارة المتجر"
        action={
          <>
            <OpButton
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate('/admin/orders')
              }
              icon={
                <ArrowRight size={16} />
              }
            >
              العودة للطلبات
            </OpButton>

            <OpButton
              size="sm"
              variant="primary"
              onClick={save}
              disabled={
                !valid ||
                loadingData ||
                createOrder.isPending
              }
              icon={
                <Save size={16} />
              }
            >
              {createOrder.isPending
                ? 'جارٍ إنشاء الطلب...'
                : 'حفظ الطلب'}
            </OpButton>
          </>
        }
      />

      {loadingData ? (
        <OpCard>
          <div className="flex min-h-[220px] items-center justify-center text-sm text-[var(--color-text-muted)]">
            جارٍ تحميل بيانات العملاء
            والمنتجات...
          </div>
        </OpCard>
      ) : loadError ? (
        <OpCard>
          <div className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700 dark:bg-red-950/20 dark:text-red-300">
            {loadError}
          </div>
        </OpCard>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <OpCard>
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-[var(--color-text-primary)]">
                  بيانات الطلب
                </h2>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  اختر العميل والمنتج وأدخل بيانات
                  الطلب.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <SearchableSelect
                    label="العميل"
                    value={
                      customerId
                        ? Number(customerId)
                        : null
                    }
                    onChange={(value) =>
                      setCustomerId(
                        value
                          ? String(value)
                          : '',
                      )
                    }
                    options={customers.map(
                      (customer) => ({
                        id: customer.id,
                        label:
                          customer.full_name,
                        sublabel:
                          customer.phone ??
                          undefined,
                      }),
                    )}
                    placeholder="اختر العميل أو ابحث..."
                  />
                </div>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    نوع الطلب
                  </span>

                  <select
                    value={orderType}
                    onChange={(event) =>
                      setOrderType(
                        event.target
                          .value as OrderType,
                      )
                    }
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="ready_made">
                      جاهز
                    </option>

                    <option value="custom">
                      مخصص
                    </option>

                    <option value="mixed">
                      مختلط
                    </option>
                  </select>
                </label>

                <div className="space-y-1.5 sm:col-span-2">
                  <SearchableSelect
                    label="المنتج"
                    value={
                      productId
                        ? Number(productId)
                        : null
                    }
                    onChange={(value) => {
                      const nextProductId = value
                        ? String(value)
                        : ''

                      setProductId(nextProductId)

                      const nextProduct = products.find(
                        (product) =>
                          product.id === Number(nextProductId),
                      )

                      if (!nextProduct?.is_customizable) {
                        setCustomizationNote('')
                      }
                    }}
                    options={products.map(
                      (product) => {
                        const available =
                          Math.max(
                            0,
                            product.stock_quantity -
                              product.reserved_quantity,
                          )

                        return {
                          id: product.id,
                          label: product.name,
                          sublabel: `${
                            product.sku
                              ? `${product.sku} — `
                              : ''
                          }${formatAmount(
                            product.price,
                          )} — المتاح: ${available}`,
                          disabled:
                            available <= 0,
                        }
                      },
                    )}
                    placeholder="اختر المنتج أو ابحث..."
                  />
                </div>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    الكمية
                  </span>

                  <input
                    type="number"
                    min="1"
                    max={
                      availableStock ||
                      undefined
                    }
                    step="1"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
                  />

                  {selectedProduct && (
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      الكمية المتاحة:{' '}
                      {availableStock}
                    </p>
                  )}
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    رسوم الشحن
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={shippingFee}
                    onChange={(event) =>
                      setShippingFee(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    تاريخ التسليم المتوقع
                  </span>

                  <input
                    type="date"
                    value={
                      expectedDeliveryDate
                    }
                    onChange={(event) =>
                      setExpectedDeliveryDate(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="space-y-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    ملاحظة التخصيص
                  </span>

                  <textarea
                    rows={5}
                    value={customizationNote}
                    onChange={(event) =>
                      setCustomizationNote(
                        event.target.value,
                      )
                    }
                    placeholder="اكتب ملاحظات التخصيص إن وجدت..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-6 outline-none"
                  />

                  {customizationNote.trim() &&
                    !selectedProduct?.is_customizable && (
                      <p className="text-xs text-red-600">
                        المنتج المختار لا يدعم
                        التخصيص.
                      </p>
                    )}
                </label>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700 dark:bg-red-950/20 dark:text-red-300">
                  {error}
                </div>
              )}
            </div>
          </OpCard>

          <div className="h-fit">
            <OpCard>
              <h2 className="text-base font-extrabold text-[var(--color-text-primary)]">
                ملخص الطلب
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--color-text-muted)]">
                    المنتج
                  </span>

                  <span className="text-left font-semibold text-[var(--color-text-primary)]">
                    {selectedProduct?.name ??
                      '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    الكمية
                  </span>

                  <span className="font-semibold">
                    {numericQuantity}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    سعر المنتج
                  </span>

                  <span className="font-semibold">
                    {formatAmount(
                      selectedProduct?.price ??
                        0,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    المجموع الفرعي
                  </span>

                  <span className="font-semibold">
                    {formatAmount(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    الشحن
                  </span>

                  <span className="font-semibold">
                    {formatAmount(
                      numericShipping,
                    )}
                  </span>
                </div>

                <div className="border-t border-[var(--color-border)] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--color-text-primary)]">
                      الإجمالي
                    </span>

                    <span className="text-lg font-extrabold text-[var(--color-accent)]">
                      {formatAmount(total)}
                    </span>
                  </div>
                </div>
              </div>
            </OpCard>
          </div>
        </div>
      )}
    </div>
  )
}
