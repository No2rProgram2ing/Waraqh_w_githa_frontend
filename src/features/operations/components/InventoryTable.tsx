import type { RawMaterial } from '../types/inventory.types'
import { OpStatusBadge } from './OpStatusBadge'
import { OpIconButton } from './OpIconButton'
import { Eye, Pencil, Trash2 } from 'lucide-react'

interface Props {
  materials: RawMaterial[]
  onView?: (m: RawMaterial) => void
  onEdit?: (m: RawMaterial) => void
  onDelete?: (m: RawMaterial) => void
}

export function InventoryTable({ materials, onView, onEdit, onDelete }: Props) {
  if (!materials.length) return <div className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">لا توجد مواد خام مطابقة.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-right text-sm">
        <thead className="bg-[var(--color-surface-subtle)] text-xs text-[var(--color-text-muted)]">
          <tr className="border-b border-[var(--color-border)]">{['اسم المادة', 'الوحدة', 'الكمية المتاحة', 'نقطة إعادة الطلب', 'الحالة', 'الإجراءات'].map((h) => <th key={h} className="px-5 py-3.5 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-subtle)]">
              <td className="px-5 py-4 font-semibold text-[var(--color-text-primary)]">{m.name}</td>
              <td className="px-5 py-4 text-[var(--color-text-secondary)]">{m.unit ?? '—'}</td>
              <td className="px-5 py-4 font-semibold tabular-nums">{m.quantity_available}</td>
              <td className="px-5 py-4">{m.reorder_point ?? '—'}</td>
              <td className="px-5 py-4"><OpStatusBadge status={String(m.status)} /></td>
              <td className="px-5 py-4"><div className="flex items-center gap-1"><OpIconButton icon={<Eye size={17} strokeWidth={1.8} />} label="عرض المادة" onClick={() => onView?.(m)} /><OpIconButton icon={<Pencil size={17} strokeWidth={1.8} />} label="تعديل المادة" onClick={() => onEdit?.(m)} /><OpIconButton icon={<Trash2 size={17} strokeWidth={1.8} />} label="حذف المادة" tone="danger" onClick={() => onDelete?.(m)} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
