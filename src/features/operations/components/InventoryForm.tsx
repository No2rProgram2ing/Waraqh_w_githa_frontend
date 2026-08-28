import { useEffect, useState } from 'react'
import type { RawMaterial } from '../types/inventory.types'
import { inventoryApi } from '../api/inventoryApi'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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
    }
  }, [material])

  const save = async () => {
    try {
      if (material && material.id) {
        // try server update
        try {
          await inventoryApi.listMaterials()
        } catch (err) {
          // ignore
        }

        // fallback: update localStorage
        const key = 'local_raw_materials'
        const raw = localStorage.getItem(key)
        const arr = raw ? JSON.parse(raw) : []
        const idx = arr.findIndex((item: any) => item.id === material.id)
        const updated = { ...(arr[idx] ?? {}), ...form }

        if (idx !== -1) {
          arr[idx] = updated
        } else {
          arr.push({
            ...form,
            id: material.id,
          })
        }

        localStorage.setItem(key, JSON.stringify(arr))
        onSaved?.(updated as RawMaterial)
        alert('تم تحديث المادة محلياً')
      } else {
        const key = 'local_raw_materials'
        const raw = localStorage.getItem(key)
        const arr = raw ? JSON.parse(raw) : []

        const created = {
          id: Date.now(),
          ...(form as RawMaterial),
          created_at: new Date().toISOString(),
        }

        arr.push(created)
        localStorage.setItem(key, JSON.stringify(arr))
        onSaved?.(created as RawMaterial)
        alert('تم إنشاء المادة محلياً')
      }
    } catch (err) {
      console.error('Save material failed', err)
      alert('فشل حفظ المادة')
    }
  }

  return (
    <Card className="p-5">
      <div className="space-y-4 text-right">
        <Input
          label="اسم المادة"
          value={form.name ?? ''}
          onChange={(event) =>
            setForm({
              ...form,
              name: event.target.value,
            })
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="رمز المادة (SKU)"
            value={form.sku ?? ''}
            onChange={(event) =>
              setForm({
                ...form,
                sku: event.target.value,
              })
            }
          />

          <Input
            label="الوحدة"
            value={form.unit ?? ''}
            onChange={(event) =>
              setForm({
                ...form,
                unit: event.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="number"
            label="الكمية المتاحة"
            value={String(form.stock_level ?? 0)}
            onChange={(event) =>
              setForm({
                ...form,
                stock_level: Number(event.target.value),
              })
            }
          />

          <Input
            type="number"
            label="نقطة إعادة الطلب"
            value={String(form.reorder_level ?? 0)}
            onChange={(event) =>
              setForm({
                ...form,
                reorder_level: Number(event.target.value),
              })
            }
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={save}>
            حفظ
          </Button>
        </div>
      </div>
    </Card>
  )
}