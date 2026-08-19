import React, { useEffect, useState } from 'react'
import type { RawMaterial } from '../types/inventory.types'
import { inventoryApi } from '../api/inventoryApi'

export function InventoryForm({
  material,
  onSaved,
}: {
  material?: RawMaterial | null
  onSaved?: (m: RawMaterial) => void
}) {
  const [form, setForm] = useState<Partial<RawMaterial>>({
    name: '',
    sku: '',
    unit: '',
    stock_level: 0,
    reorder_level: 0,
  })

  useEffect(() => {
    if (material) {
      setForm(material)
    } else {
      setForm({ name: '', sku: '', unit: '', stock_level: 0, reorder_level: 0 })
    }
  }, [material])

  const save = async () => {
    try {
      if (material && material.id) {
        // try server update
        try {
          const resp = await inventoryApi.listMaterials() // noop to ensure module loaded - actual update via adjustStock is separate
        } catch (err) {
          // ignore
        }

        // fallback: update localStorage
        const key = 'local_raw_materials'
        const raw = localStorage.getItem(key)
        const arr = raw ? JSON.parse(raw) : []
        const idx = arr.findIndex((it: any) => it.id === material.id)
        const updated = { ...(arr[idx] ?? {}), ...form }
        if (idx !== -1) arr[idx] = updated
        else arr.push({ id: material.id, ...form })
        localStorage.setItem(key, JSON.stringify(arr))
        onSaved && onSaved(updated as RawMaterial)
        alert('تم تحديث المادة محلياً')
      } else {
        // create
        const key = 'local_raw_materials'
        const raw = localStorage.getItem(key)
        const arr = raw ? JSON.parse(raw) : []
        const created = { id: Date.now(), ...(form as RawMaterial), created_at: new Date().toISOString() }
        arr.push(created)
        localStorage.setItem(key, JSON.stringify(arr))
        onSaved && onSaved(created as RawMaterial)
        alert('تم إنشاء المادة محلياً')
      }
    } catch (err) {
      console.error('Save material failed', err)
      alert('فشل حفظ المادة')
    }
  }

  const isEditing = !!(material && material.id)

  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
      {/* Form header */}
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">
          {isEditing ? 'تعديل المادة' : 'إضافة مادة جديدة'}
        </h2>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          {isEditing ? `تعديل بيانات: ${material?.name}` : 'أدخل بيانات المادة الخام الجديدة'}
        </p>
      </div>

      {/* Form body */}
      <div className="space-y-4 p-5" dir="rtl">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="inv-name"
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            اسم المادة
          </label>
          <input
            id="inv-name"
            type="text"
            value={form.name ?? ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: قماش قطني"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
          />
        </div>

        {/* SKU + Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-sku"
              className="text-sm font-medium text-[var(--color-text-primary)]"
            >
              رمز المادة (SKU)
            </label>
            <input
              id="inv-sku"
              type="text"
              value={form.sku ?? ''}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="مثال: FAB-001"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-unit"
              className="text-sm font-medium text-[var(--color-text-primary)]"
            >
              الوحدة
            </label>
            <input
              id="inv-unit"
              type="text"
              value={form.unit ?? ''}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="مثال: متر، كجم"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
            />
          </div>
        </div>

        {/* Stock level + Reorder level */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-stock"
              className="text-sm font-medium text-[var(--color-text-primary)]"
            >
              الكمية المتاحة
            </label>
            <input
              id="inv-stock"
              type="number"
              min="0"
              value={String(form.stock_level ?? 0)}
              onChange={(e) => setForm({ ...form, stock_level: Number(e.target.value) })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-reorder"
              className="text-sm font-medium text-[var(--color-text-primary)]"
            >
              نقطة إعادة الطلب
            </label>
            <input
              id="inv-reorder"
              type="number"
              min="0"
              value={String(form.reorder_level ?? 0)}
              onChange={(e) => setForm({ ...form, reorder_level: Number(e.target.value) })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      {/* Form footer / actions */}
      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] px-5 py-4">
        <button
          id="inv-form-save-btn"
          onClick={save}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)]"
        >
          {isEditing ? 'حفظ التعديلات' : 'إضافة المادة'}
        </button>
      </div>
    </div>
  )
}
