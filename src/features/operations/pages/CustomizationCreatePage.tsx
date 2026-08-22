import { useState, useMemo } from 'react'
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

export default function CustomizationCreatePage() {
  const navigate = useNavigate()
  const create = useCreateCustomization()
  const [form, setForm] = useState({ customer_id: '', base_product_id: '', color_id: '', design_pattern_id: '', quantity: '1', length_cm: '', width_cm: '', height_cm: '', customer_notes: '' })

  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [colorSearch, setColorSearch] = useState('')
  const [patternSearch, setPatternSearch] = useState('')

  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({ search: customerSearch, per_page: 50 })
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ search: productSearch, per_page: 50 })
  const { data: colorsData, isLoading: isLoadingColors } = useColors()
  const { data: patternsData, isLoading: isLoadingPatterns } = usePatterns()
  const { formatAmount } = useSystemCurrency()

  const customerOptions = customersData?.data?.map(c => ({
    id: c.id,
    label: c.full_name,
    sublabel: c.phone || undefined
  })) || []

  const productOptions = productsData?.data?.map(p => ({
    id: p.id,
    label: p.name,
    sublabel: `${p.sku ? p.sku + ' — ' : ''}${formatAmount(p.price)}`,
    disabled: p.stock_quantity <= 0
  })) || []

  const colorOptions = useMemo(() => {
    const all = (colorsData ?? []).map(c => ({ id: c.id, label: c.name, sublabel: c.hex_code }))
    const q = colorSearch.trim().toLowerCase()
    return q ? all.filter(c => c.label.toLowerCase().includes(q)) : all
  }, [colorsData, colorSearch])

  const patternOptions = useMemo(() => {
    const all = (patternsData ?? []).map(p => ({ id: p.id, label: p.name }))
    const q = patternSearch.trim().toLowerCase()
    return q ? all.filter(p => p.label.toLowerCase().includes(q)) : all
  }, [patternsData, patternSearch])

  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const save = () => {
    const payload: Record<string, unknown> = {
      customer_id: Number(form.customer_id), base_product_id: Number(form.base_product_id), quantity: Number(form.quantity),
      color_id: form.color_id ? Number(form.color_id) : null, design_pattern_id: form.design_pattern_id ? Number(form.design_pattern_id) : null,
      length_cm: form.length_cm ? Number(form.length_cm) : null, width_cm: form.width_cm ? Number(form.width_cm) : null, height_cm: form.height_cm ? Number(form.height_cm) : null,
      customer_notes: form.customer_notes || null,
    }
    create.mutate(payload, { onSuccess: () => navigate('/admin/customizations') })
  }

  const valid = Number(form.customer_id) > 0 && Number(form.base_product_id) > 0 && Number(form.quantity) > 0

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>إضافة تخصيص جديد — لوحة الإدارة</title></Helmet>
      <OpPageHeader title="إضافة تخصيص جديد" description="إنشاء طلب تخصيص جديد من لوحة الإدارة" action={<><OpButton size="sm" variant="ghost" onClick={() => navigate('/admin/customizations')} icon={<ArrowRight size={16} />}>العودة</OpButton><OpButton size="sm" variant="primary" onClick={save} disabled={!valid || create.isPending} icon={<Save size={16} />}>{create.isPending ? 'جارٍ الحفظ...' : 'حفظ التخصيص'}</OpButton></>} />
      <OpCard>
        <div className="grid gap-5 sm:grid-cols-2">
          <SearchableSelect
            label="العميل"
            value={form.customer_id ? Number(form.customer_id) : null}
            onChange={val => set('customer_id', val ? String(val) : '')}
            options={customerOptions}
            onSearch={setCustomerSearch}
            loading={isLoadingCustomers}
            placeholder="ابحث عن اسم العميل أو الهاتف..."
            emptyMessage="لم يتم العثور على عملاء"
          />
          <SearchableSelect
            label="المنتج الأساسي"
            value={form.base_product_id ? Number(form.base_product_id) : null}
            onChange={val => set('base_product_id', val ? String(val) : '')}
            options={productOptions}
            onSearch={setProductSearch}
            loading={isLoadingProducts}
            placeholder="ابحث عن اسم المنتج أو SKU..."
            emptyMessage="لم يتم العثور على منتجات"
          />
          <SearchableSelect
            label="اللون (اختياري)"
            value={form.color_id ? Number(form.color_id) : null}
            onChange={val => set('color_id', val ? String(val) : '')}
            options={colorOptions}
            onSearch={setColorSearch}
            loading={isLoadingColors}
            placeholder="ابحث عن اللون..."
            emptyMessage="لم يتم العثور على ألوان"
          />
          <SearchableSelect
            label="النقشة (اختياري)"
            value={form.design_pattern_id ? Number(form.design_pattern_id) : null}
            onChange={val => set('design_pattern_id', val ? String(val) : '')}
            options={patternOptions}
            onSearch={setPatternSearch}
            loading={isLoadingPatterns}
            placeholder="ابحث عن النقشة..."
            emptyMessage="لم يتم العثور على نقوش"
          />
          <label className="space-y-1.5"><span className="text-xs font-semibold text-[var(--color-text-secondary)]">الكمية</span><input type="number" min="1" value={form.quantity} onChange={e => set('quantity',e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" /></label>
          {([['length_cm','الطول (سم)'],['width_cm','العرض (سم)'],['height_cm','الارتفاع (سم)']] as const).map(([key,label]) => <label key={key} className="space-y-1.5"><span className="text-xs font-semibold text-[var(--color-text-secondary)]">{label}</span><input type="number" min="0" value={form[key]} onChange={e => set(key,e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" /></label>)}
          <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-semibold text-[var(--color-text-secondary)]">ملاحظات العميل</span><textarea rows={5} value={form.customer_notes} onChange={e => set('customer_notes',e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm outline-none focus:border-[var(--color-accent)]" /></label>
        </div>
        <p className="mt-5 rounded-xl bg-[var(--color-surface-subtle)] p-3 text-xs leading-5 text-[var(--color-text-muted)]">ملاحظة: اللون والنقشة اختياريان ويمكنك تركهما فارغين.</p>
      </OpCard>
    </div>
  )
}
