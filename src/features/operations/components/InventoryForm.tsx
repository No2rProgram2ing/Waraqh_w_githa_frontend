import { useEffect, useState } from 'react'
import type { RawMaterial, RawMaterialStatus } from '../types/inventory.types'
import { useCreateMaterial, useUpdateMaterial } from '../hooks/useInventory'
import { OpButton } from './OpButton'
import { OpModal } from './OpModal'

function deriveStatus(q: number, r: number): RawMaterialStatus {
  if (q <= 0) return 'out_of_stock'
  if (q <= r) return 'low_stock'
  return 'in_stock'
}

interface InventoryFormProps {
  open: boolean
  material?: RawMaterial | null
  onClose: () => void
  onSaved?: () => void
}

export function InventoryForm({ open, material, onClose, onSaved }: InventoryFormProps) {
  const [form, setForm] = useState({ name: '', unit: '', quantity_available: 0, reorder_point: 0, status: 'in_stock' as RawMaterialStatus })
  const create = useCreateMaterial()
  const update = useUpdateMaterial()

  useEffect(() => {
    if (material) {
      setForm({ name: material.name, unit: material.unit, quantity_available: Number(material.quantity_available), reorder_point: Number(material.reorder_point), status: material.status })
    } else {
      setForm({ name: '', unit: '', quantity_available: 0, reorder_point: 0, status: 'in_stock' })
    }
  }, [material, open])

  const save = async () => {
    const payload = { ...form, status: deriveStatus(form.quantity_available, form.reorder_point) }
    if (material) await update.mutateAsync({ id: material.id, payload })
    else await create.mutateAsync(payload)
    onSaved?.()
    onClose()
  }

  const busy = create.isPending || update.isPending

  return (
    <OpModal
      open={open}
      onClose={onClose}
      title={material ? 'تعديل المادة' : 'إضافة مادة جديدة'}
      description="أدخل بيانات المادة ثم احفظ التغييرات. حالة المخزون تُحسب تلقائياً من الكمية ونقطة إعادة الطلب."
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">اسم المادة</span>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: خشب الصنوبر" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">الوحدة</span>
            <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="متر، كجم، قطعة..." className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">الكمية المتاحة</span>
            <input type="number" min="0" value={form.quantity_available} onChange={e => setForm({ ...form, quantity_available: Number(e.target.value) })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">نقطة إعادة الطلب</span>
            <input type="number" min="0" value={form.reorder_point} onChange={e => setForm({ ...form, reorder_point: Number(e.target.value) })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" />
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-4">
          <OpButton variant="ghost" onClick={onClose} disabled={busy}>إلغاء</OpButton>
          <OpButton variant="primary" disabled={busy || !form.name.trim() || !form.unit.trim()} onClick={() => void save()}>{busy ? 'جارٍ الحفظ...' : material ? 'حفظ التعديلات' : 'إضافة المادة'}</OpButton>
        </div>
      </div>
    </OpModal>
  )
}
