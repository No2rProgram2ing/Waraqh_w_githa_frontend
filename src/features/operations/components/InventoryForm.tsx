import React, { useEffect, useState } from 'react'
import type { RawMaterial } from '../types/inventory.types'
import { useMaterials } from '../hooks/useInventory'
import { inventoryApi } from '../api/inventoryApi'

export function InventoryForm({ material, onSaved }: { material?: RawMaterial | null; onSaved?: (m: RawMaterial) => void }){
  const [form, setForm] = useState<Partial<RawMaterial>>({
    name: '',
    sku: '',
    unit: '',
    stock_level: 0,
    reorder_level: 0,
  })

  useEffect(() => {
    if (material) setForm(material)
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

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-right space-y-3">
        <div>
          <label className="text-sm">اسم المادة</label>
          <input className="w-full rounded-md border p-2 mt-1" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">رمز المادة (SKU)</label>
            <input className="w-full rounded-md border p-2 mt-1" value={form.sku ?? ''} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>

          <div>
            <label className="text-sm">الوحدة</label>
            <input className="w-full rounded-md border p-2 mt-1" value={form.unit ?? ''} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">الكمية المتاحة</label>
            <input type="number" className="w-full rounded-md border p-2 mt-1" value={String(form.stock_level ?? 0)} onChange={(e) => setForm({ ...form, stock_level: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-sm">نقطة إعادة الطلب</label>
            <input type="number" className="w-full rounded-md border p-2 mt-1" value={String(form.reorder_level ?? 0)} onChange={(e) => setForm({ ...form, reorder_level: Number(e.target.value) })} />
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={save} className="rounded-md bg-[#3b6a2b] px-4 py-2 text-white">حفظ</button>
        </div>
      </div>
    </div>
  )
}
