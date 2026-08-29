import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { FreeDesignRequest } from '../types/freeDesign.types'
import { OpIconButton } from './OpIconButton'
import { OpStatusBadge } from './OpStatusBadge'

export function FreeDesignList({ items, onView, onEdit, onDelete }: { items: FreeDesignRequest[]; onView: (id: number) => void; onEdit: (id: number) => void; onDelete: (id: number) => void }) {
  if (!items.length) return <div className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">لا توجد طلبات تصميم حر.</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-right text-sm">
        <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-xs text-[var(--color-text-muted)]">
          <tr>{['#', 'العميل', 'الوصف', 'الحالة', 'التاريخ', 'الإجراءات'].map((head) => <th key={head} className="px-5 py-3.5 font-semibold">{head}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-subtle)]">
              <td className="px-5 py-4 font-semibold text-[var(--color-text-primary)]">{item.id}</td>
              <td className="px-5 py-4 text-[var(--color-text-primary)]">{item.customer.full_name ?? '—'}</td>
              <td className="max-w-sm px-5 py-4 text-[var(--color-text-secondary)]"><span className="line-clamp-2">{item.description ?? '—'}</span></td>
              <td className="px-5 py-4"><OpStatusBadge status={String(item.status)} /></td>
              <td className="px-5 py-4 text-[var(--color-text-muted)]">{item.created_at ? new Date(item.created_at).toLocaleDateString('ar-SA') : '—'}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1">
                  <OpIconButton icon={<Eye size={17} strokeWidth={1.8} />} label="عرض" onClick={() => onView(item.id)} />
                  <OpIconButton icon={<Pencil size={17} strokeWidth={1.8} />} label="تعديل" onClick={() => onEdit(item.id)} />
                  <OpIconButton icon={<Trash2 size={17} strokeWidth={1.8} />} label="حذف" tone="danger" onClick={() => onDelete(item.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
