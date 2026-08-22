import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useCreateCustomization } from '../hooks/useCustomizations'
import { OpButton } from '../components/OpButton'
import { OpCard } from '../components/OpCard'
import { OpPageHeader } from '../components/OpPageHeader'
import { SearchableSelect } from '@/components/ui/SearchableSelect'

import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import { useSystemCurrency } from '@/lib/currency'
import { useColors } from '@/features/design/hooks/useColors'
import { usePatterns } from '@/features/design/hooks/usePatterns'

import type { Product } from '@/features/catalog/types/product'

export default function CustomizationCreatePage() {
  const navigate = useNavigate()
  const create = useCreateCustomization()

  const [form, setForm] = useState({
    customer_id: '',
    base_product_id: '',
    color_id: '',
    design_pattern_id: '',
    quantity: '1',
    length_cm: '',
    width_cm: '',
    height_cm: '',
    customer_notes: '',
  })

  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [colorSearch, setColorSearch] = useState('')
  const [patternSearch, setPatternSearch] = useState('')

  const [attributeValues, setAttributeValues] = useState<
    Record<number, string>
  >({})

  const [attributeError, setAttributeError] = useState('')

  const {
    data: customersData,
    isLoading: isLoadingCustomers,
  } = useCustomers({
    search: customerSearch,
    per_page: 50,
  })

  const {
    data: productsData,
    isLoading: isLoadingProducts,
  } = useProducts({
    search: productSearch,
    per_page: 50,
  })

  const {
    data: colorsData,
    isLoading: isLoadingColors,
  } = useColors()

  const {
    data: patternsData,
    isLoading: isLoadingPatterns,
  } = usePatterns()

  const { formatAmount } = useSystemCurrency()

  const customerOptions =
    customersData?.data?.map((customer) => ({
      id: customer.id,
      label: customer.full_name,
      sublabel: customer.phone || undefined,
    })) ?? []

  const productOptions =
    productsData?.data?.map((product) => ({
      id: product.id,
      label: product.name,
      sublabel: `${product.sku ? `${product.sku} — ` : ''}${formatAmount(product.price)}`,
      disabled: product.stock_quantity <= 0,
    })) ?? []

  const selectedProduct: Product | null = useMemo(() => {
    const selectedId = Number(form.base_product_id)

    if (!selectedId) {
      return null
    }

    return (
      productsData?.data?.find(
        (product) => product.id === selectedId,
      ) ?? null
    )
  }, [form.base_product_id, productsData?.data])

  const selectedProductAttributes =
    selectedProduct?.attributes ?? []

  const colorOptions = useMemo(() => {
    const all =
      (colorsData ?? []).map((color) => ({
        id: color.id,
        label: color.name,
        sublabel: color.hex_code,
      }))

    const query = colorSearch.trim().toLowerCase()

    return query
      ? all.filter((color) =>
          color.label.toLowerCase().includes(query),
        )
      : all
  }, [colorsData, colorSearch])

  const patternOptions = useMemo(() => {
    const all =
      (patternsData ?? []).map((pattern) => ({
        id: pattern.id,
        label: pattern.name,
      }))

    const query = patternSearch.trim().toLowerCase()

    return query
      ? all.filter((pattern) =>
          pattern.label.toLowerCase().includes(query),
        )
      : all
  }, [patternsData, patternSearch])

  const set = (
    key: keyof typeof form,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const resetProductAttributes = () => {
    setAttributeValues({})
    setAttributeError('')
  }

  const handleProductChange = (
    value: string | number | null,
  ) => {
    set(
      'base_product_id',
      value !== null && value !== ''
        ? String(value)
        : '',
    )

    resetProductAttributes()
  }

  const handleAttributeChange = (
    attributeId: number,
    value: string,
  ) => {
    setAttributeValues((current) => ({
      ...current,
      [attributeId]: value,
    }))

    setAttributeError('')
  }

  const getAttributeInput = (
    attribute: NonNullable<Product['attributes']>[number],
  ) => {
    const value =
      attributeValues[attribute.id] ?? ''

    const className =
      'mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]'

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
            <option value="">
              اختر قيمة
            </option>

            {(attribute.options ?? []).map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ),
            )}
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
            placeholder={`أدخل ${attribute.display_name}`}
            className={className}
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
            <option value="">
              اختر
            </option>
            <option value="true">
              نعم
            </option>
            <option value="false">
              لا
            </option>
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
            placeholder={`أدخل ${attribute.display_name}`}
            className={className}
          />
        )
    }
  }

  const validateAttributes = (): boolean => {
    const missingAttribute =
      selectedProductAttributes.find(
        (attribute) =>
          attribute.is_required &&
          !(attributeValues[attribute.id] ?? '').trim(),
      )

    if (missingAttribute) {
      setAttributeError(
        `يرجى إدخال قيمة الخاصية المطلوبة: ${missingAttribute.display_name}`,
      )

      return false
    }

    setAttributeError('')
    return true
  }

  const save = () => {
    if (!validateAttributes()) {
      return
    }

    const payload: Record<string, unknown> = {
      customer_id: Number(form.customer_id),
      base_product_id: Number(form.base_product_id),
      quantity: Number(form.quantity),

      color_id: form.color_id
        ? Number(form.color_id)
        : null,

      design_pattern_id: form.design_pattern_id
        ? Number(form.design_pattern_id)
        : null,

      customer_notes: form.customer_notes || null,

      attribute_values: selectedProductAttributes
        .filter(
          (attribute) =>
            (attributeValues[attribute.id] ?? '').trim() !== '',
        )
        .map((attribute) => ({
          attribute_id: attribute.id,
          value: attributeValues[attribute.id].trim(),
        })),
    }

    create.mutate(payload, {
      onSuccess: () =>
        navigate('/admin/customizations'),
    })
  }

  const valid =
    Number(form.customer_id) > 0 &&
    Number(form.base_product_id) > 0 &&
    Number(form.quantity) > 0

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>
          إضافة تخصيص جديد — لوحة الإدارة
        </title>
      </Helmet>

      <OpPageHeader
        title="إضافة تخصيص جديد"
        description="إنشاء طلب تخصيص جديد من لوحة الإدارة"
        action={
          <>
            <OpButton
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate('/admin/customizations')
              }
              icon={<ArrowRight size={16} />}
            >
              العودة
            </OpButton>

            <OpButton
              size="sm"
              variant="primary"
              onClick={save}
              disabled={
                !valid || create.isPending
              }
              icon={<Save size={16} />}
            >
              {create.isPending
                ? 'جارٍ الحفظ...'
                : 'حفظ التخصيص'}
            </OpButton>
          </>
        }
      />

      <OpCard>
        <div className="grid gap-5 sm:grid-cols-2">
          <SearchableSelect
            label="العميل"
            value={
              form.customer_id
                ? Number(form.customer_id)
                : null
            }
            onChange={(value) =>
              set(
                'customer_id',
                value
                  ? String(value)
                  : '',
              )
            }
            options={customerOptions}
            onSearch={setCustomerSearch}
            loading={isLoadingCustomers}
            placeholder="ابحث عن اسم العميل أو الهاتف..."
            emptyMessage="لم يتم العثور على عملاء"
          />

          <SearchableSelect
            label="المنتج الأساسي"
            value={
              form.base_product_id
                ? Number(form.base_product_id)
                : null
            }
            onChange={handleProductChange}
            options={productOptions}
            onSearch={setProductSearch}
            loading={isLoadingProducts}
            placeholder="ابحث عن اسم المنتج أو SKU..."
            emptyMessage="لم يتم العثور على منتجات"
          />

          {selectedProduct && (
            <div className="sm:col-span-2 rounded-xl bg-[var(--color-surface-subtle)] px-4 py-3">
              <p className="text-xs text-[var(--color-text-muted)]">
                المنتج المحدد
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {selectedProduct.name}
              </p>
            </div>
          )}

          <SearchableSelect
            label="اللون (اختياري)"
            value={
              form.color_id
                ? Number(form.color_id)
                : null
            }
            onChange={(value) =>
              set(
                'color_id',
                value
                  ? String(value)
                  : '',
              )
            }
            options={colorOptions}
            onSearch={setColorSearch}
            loading={isLoadingColors}
            placeholder="ابحث عن اللون..."
            emptyMessage="لم يتم العثور على ألوان"
          />

          <SearchableSelect
            label="النقشة (اختياري)"
            value={
              form.design_pattern_id
                ? Number(
                    form.design_pattern_id,
                  )
                : null
            }
            onChange={(value) =>
              set(
                'design_pattern_id',
                value
                  ? String(value)
                  : '',
              )
            }
            options={patternOptions}
            onSearch={setPatternSearch}
            loading={isLoadingPatterns}
            placeholder="ابحث عن النقشة..."
            emptyMessage="لم يتم العثور على نقش"
          />

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              الكمية
            </span>

            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) =>
                set(
                  'quantity',
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
            />
          </label>

          {/*(
            [
              ['length_cm', 'الطول (سم)'],
              ['width_cm', 'العرض (سم)'],
              ['height_cm', 'الارتفاع (سم)'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="space-y-1.5"
            >
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                {label}
              </span>

              <input
                type="number"
                min="0"
                value={form[key]}
                onChange={(event) =>
                  set(
                    key,
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
              />
            </label>
          ))*/}

          {form.base_product_id && (
            <section className="sm:col-span-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="mb-4">
                <h2 className="font-bold text-[var(--color-text-primary)]">
                  خصائص المنتج
                </h2>

                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  تظهر هنا الخصائص المرتبطة بالمنتج المحدد فقط.
                </p>
              </div>

              {selectedProductAttributes.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
                  لا توجد خصائص مرتبطة بهذا المنتج.
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {selectedProductAttributes.map(
                    (attribute) => (
                      <div
                        key={attribute.id}
                      >
                        <label
                          htmlFor={`customization-attribute-${attribute.id}`}
                          className="text-sm font-medium text-[var(--color-text-secondary)]"
                        >
                          {
                            attribute.display_name
                          }

                          {attribute.is_required && (
                            <span className="mr-1 text-[var(--color-danger)]">
                              *
                            </span>
                          )}
                        </label>

                        <div
                          id={`customization-attribute-${attribute.id}`}
                        >
                          {getAttributeInput(
                            attribute,
                          )}
                        </div>

                        {attribute.input_type ===
                          'select' &&
                          !attribute.options
                            ?.length && (
                            <p className="mt-1 text-xs text-[var(--color-danger)]">
                              لا توجد خيارات معرفة لهذه الخاصية.
                            </p>
                          )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {attributeError && (
                <div className="mt-4 rounded-xl bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
                  {attributeError}
                </div>
              )}

             {selectedProductAttributes.length > 0 && (
              <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3 text-xs leading-5 text-[var(--color-text-muted)]">
                سيتم حفظ قيم الخصائص المحددة ضمن طلب التخصيص ويمكن الرجوع إليها لاحقًا.
              </div>
            )}
            </section>
          )}

          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              ملاحظات العميل
            </span>

            <textarea
              rows={5}
              value={form.customer_notes}
              onChange={(event) =>
                set(
                  'customer_notes',
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm outline-none focus:border-[var(--color-accent)]"
            />
          </label>
        </div>

        <p className="mt-5 rounded-xl bg-[var(--color-surface-subtle)] p-3 text-xs leading-5 text-[var(--color-text-muted)]">
          اللون والنقشة اختياريان ويمكنك تركهما فارغين.
        </p>
      </OpCard>
    </div>
  )
}
