import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { axiosAdminClient } from '@/api/axiosAdminClient'

import { OpButton } from '../components/OpButton'
import { OpCard } from '../components/OpCard'
import { OpPageHeader } from '../components/OpPageHeader'
import { useCreateOrder } from '../hooks/useOrders'

import type { CreateOrderPayload, OrderType } from '../types/orders.types'

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

function unwrapCollection(payload: any): any[] {
  const data = payload?.data?.data ?? payload?.data ?? []
  return Array.isArray(data) ? data : []
}

function getApiErrorMessage(error: any): string {
  const response = error?.response?.data

  if (typeof response?.message === 'string' && response.message.trim()) {
    return response.message
  }

  if (response?.errors && typeof response.errors === 'object') {
    const messages = Object.values(response.errors)
      .flatMap((value: any) => Array.isArray(value) ? value : [value])
      .filter((value): value is string => typeof value === 'string')

    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  return 'تعذر إنشاء الطلب. حاول مرة أخرى.'
}

export default function OrderCreatePage() {
  const navigate = useNavigate()
  const createOrder = useCreateOrder()

  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [orderType, setOrderType] = useState<OrderType>('ready_made')
  const [shippingFee, setShippingFee] = useState('0')
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('')
  const [customizationNote, setCustomizationNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        setLoadingData(true)
        setLoadError('')

        const [customersResponse, productsResponse] = await Promise.all([
          axiosAdminClient.get('/admin/customers', {
            params: { per_page: 100 },
          }),
          axiosAdminClient.get('/admin/products', {
            params: { per_page: 100 },
          }),
        ])

        if (!mounted) return

        const customersData = unwrapCollection(customersResponse.data)
        const productsData = unwrapCollection(productsResponse.data)

        setCustomers(
          customersData
            .map((customer: any) => ({
              id: Number(customer.id),
              full_name: String(customer.full_name ?? customer.name ?? ''),
              phone: customer.phone ?? null,
            }))
            .filter((customer) => customer.id > 0 && customer.full_name),
        )

        setProducts(
          productsData
            .map((product: any) => ({
              id: Number(product.id),
              name: String(product.name ?? ''),
              sku: product.sku ?? null,
              price: Number(product.price ?? 0),
              stock_quantity: Number(product.stock_quantity ?? 0),
              reserved_quantity: Number(product.reserved_quantity ?? 0),
              is_customizable: Boolean(product.is_customizable),
            }))
            .filter((product) => product.id > 0 && product.name),
        )
      } catch (err) {
        console.error('OrderCreatePage load error:', err)
        if (mounted) {
          setLoadError(
            'تعذر تحميل العملاء والمنتجات. تأكد من تسجيل دخول الإدارة واتصال الخادم.',
          )
        }
      } finally {
        if (mounted) setLoadingData(false)
      }
    }

    void loadData()

    return () => {
      mounted = false
    }
  }, [])

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === Number(productId)) ?? null,
    [products, productId],
  )

  const availableStock = selectedProduct
    ? Math.max(
        0,
        selectedProduct.stock_quantity - selectedProduct.reserved_quantity,
      )
    : 0

  const numericQuantity = Number(quantity) || 0
  const numericShipping = Math.max(0, Number(shippingFee) || 0)
  const subtotal = selectedProduct && numericQuantity > 0
    ? selectedProduct.price * numericQuantity
    : 0
  const total = subtotal + numericShipping

  const customizationIsValid =
    !customizationNote.trim() || Boolean(selectedProduct?.is_customizable)

  const valid =
    Number(customerId) > 0 &&
    Number(productId) > 0 &&
    Number.isInteger(numericQuantity) &&
    numericQuantity > 0 &&
    numericQuantity <= availableStock &&
    customizationIsValid

  const save = () => {
    setError('')

    if (!valid) {
      setError('يرجى التأكد من اختيار العميل والمنتج والكمية المتاحة وبيانات التخصيص.')
      return
    }

    const payload: CreateOrderPayload = {
      customer_id: Number(customerId),
      order_type: orderType,
      expected_delivery_date: expectedDeliveryDate || null,
      shipping_fee: numericShipping,
      items: [
        {
          product_id: Number(productId),
          quantity: numericQuantity,
          customization_note: customizationNote.trim() || null,
        },
      ],
    }

    createOrder.mutate(payload, {
      onSuccess: (order) => {
        navigate(`/admin/orders/${order.id}`, { replace: true })
      },
      onError: (err) => {
        console.error('OrderCreatePage create error:', err)
        setError(getApiErrorMessage(err))
      },
    })
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>إضافة طلب جديد — لوحة الإدارة</title>
      </Helmet>

      <OpPageHeader
        title="إضافة طلب جديد"
        description="إنشاء طلب جديد من لوحة إدارة المتجر"
        action={
          <>
            <OpButton
              size="sm"
              variant="ghost"
              onClick={() => navigate('/admin/orders')}
              icon={<ArrowRight size={16} />}
            >
              العودة للطلبات
            </OpButton>

            <OpButton
              size="sm"
              variant="primary"
              onClick={save}
              disabled={!valid || loadingData || createOrder.isPending}
              icon={<Save size={16} />}
            >
              {createOrder.isPending ? 'جارٍ إنشاء الطلب...' : 'حفظ الطلب'}
            </OpButton>
          </>
        }
      />

      {loadingData ? (
        <OpCard>
          <div className="flex min-h-[220px] items-center justify-center text-sm text-[var(--color-text-muted)]">
            جارٍ تحميل بيانات العملاء والمنتجات...
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
                  اختر العميل والمنتج وأدخل بيانات الطلب.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    العميل
                  </span>
                  <select
                    value={customerId}
                    onChange={(event) => setCustomerId(event.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="">اختر العميل</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name}{customer.phone ? ` — ${customer.phone}` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    نوع الطلب
                  </span>
                  <select
                    value={orderType}
                    onChange={(event) => setOrderType(event.target.value as OrderType)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="ready_made">جاهز</option>
                    <option value="custom">مخصص</option>
                    <option value="mixed">مختلط</option>
                  </select>
                </label>

                <label className="space-y-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    المنتج
                  </span>
                  <select
                    value={productId}
                    onChange={(event) => setProductId(event.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="">اختر المنتج</option>
                    {products.map((product) => {
                      const available = Math.max(
                        0,
                        product.stock_quantity - product.reserved_quantity,
                      )

                      return (
                        <option key={product.id} value={product.id} disabled={available <= 0}>
                          {product.name}
                          {product.sku ? ` — ${product.sku}` : ''}
                          {' — '}{product.price} ر.س — المتاح: {available}
                        </option>
                      )
                    })}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    الكمية
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={availableStock || undefined}
                    step="1"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                  {selectedProduct && (
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      الكمية المتاحة: {availableStock}
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
                    onChange={(event) => setShippingFee(event.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    تاريخ التسليم المتوقع
                  </span>
                  <input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(event) => setExpectedDeliveryDate(event.target.value)}
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
                    onChange={(event) => setCustomizationNote(event.target.value)}
                    placeholder="اكتب ملاحظات التخصيص إن وجدت..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-6 outline-none focus:border-[var(--color-accent)]"
                  />
                  {customizationNote.trim() && !selectedProduct?.is_customizable && (
                    <p className="text-xs text-red-600">
                      المنتج المختار لا يدعم التخصيص.
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
                  <span className="text-[var(--color-text-muted)]">المنتج</span>
                  <span className="text-left font-semibold text-[var(--color-text-primary)]">
                    {selectedProduct?.name ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">الكمية</span>
                  <span className="font-semibold">{numericQuantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">سعر المنتج</span>
                  <span className="font-semibold">{selectedProduct?.price ?? 0} ر.س</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">المجموع الفرعي</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} ر.س</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">الشحن</span>
                  <span className="font-semibold">{numericShipping.toFixed(2)} ر.س</span>
                </div>
                <div className="border-t border-[var(--color-border)] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--color-text-primary)]">الإجمالي</span>
                    <span className="text-lg font-extrabold text-[var(--color-accent)]">
                      {total.toFixed(2)} ر.س
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
