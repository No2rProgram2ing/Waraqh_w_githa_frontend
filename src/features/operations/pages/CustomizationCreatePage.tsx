import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCreateCustomization } from '../hooks/useCustomizations'
import { OpButton } from '../components/OpButton'
import { OpCard } from '../components/OpCard'
import { OpPageHeader } from '../components/OpPageHeader'

export default function CustomizationCreatePage() {
  const navigate = useNavigate()
  const create = useCreateCustomization()
  const [form, setForm] = useState({ customer_id: '', base_product_id: '', color_id: '', design_pattern_id: '', quantity: '1', length_cm: '', width_cm: '', height_cm: '', customer_notes: '' })

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
          {([['customer_id','معرف العميل','مثال: 12'],['base_product_id','معرف المنتج','مثال: 8'],['color_id','معرف اللون (اختياري)',''],['design_pattern_id','معرف النقشة (اختياري)','']] as const).map(([key,label,placeholder]) => <label key={key} className="space-y-1.5"><span className="text-xs font-semibold text-[var(--color-text-secondary)]">{label}</span><input value={form[key]} onChange={e => set(key,e.target.value)} placeholder={placeholder} inputMode="numeric" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" /></label>)}
          <label className="space-y-1.5"><span className="text-xs font-semibold text-[var(--color-text-secondary)]">الكمية</span><input type="number" min="1" value={form.quantity} onChange={e => set('quantity',e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" /></label>
          {([['length_cm','الطول (سم)'],['width_cm','العرض (سم)'],['height_cm','الارتفاع (سم)']] as const).map(([key,label]) => <label key={key} className="space-y-1.5"><span className="text-xs font-semibold text-[var(--color-text-secondary)]">{label}</span><input type="number" min="0" value={form[key]} onChange={e => set(key,e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" /></label>)}
          <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-semibold text-[var(--color-text-secondary)]">ملاحظات العميل</span><textarea rows={5} value={form.customer_notes} onChange={e => set('customer_notes',e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm outline-none focus:border-[var(--color-accent)]" /></label>
        </div>
        <p className="mt-5 rounded-xl bg-[var(--color-surface-subtle)] p-3 text-xs leading-5 text-[var(--color-text-muted)]">ملاحظة: معرف العميل والمنتج واللون والنقشة يجب أن تكون موجودة في قاعدة البيانات.</p>
      </OpCard>
    </div>
  )
}
