import React from 'react'
import type { RawMaterial } from '../types/inventory.types'
import { OpStatusBadge } from './OpStatusBadge'
import { Pencil } from 'lucide-react'

function getStockStatus(material: RawMaterial): string {
  if (material.stock_level <= 0) return 'out_of_stock'
  if (material.stock_level <= (material.reorder_level ?? 0)) return 'low_stock'
  return 'available'
}

interface InventoryTableProps {
  materials: RawMaterial[]
  onEdit?: (material: RawMaterial) => void
}

export function InventoryTable({ materials, onEdit }: InventoryTableProps) {
  if (!materials.length) {
    return (
      <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
          <p className="text-sm font-medium text-[var(--color-text-muted)]">لا توجد مواد خام مسجّلة.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">قائمة المواد الخام</h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">جميع المواد المسجّلة في المخزون</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px] text-right">
          <thead className="bg-[var(--color-surface)]">
            <tr className="border-b border-[var(--color-border)]">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                اسم المادة
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                الرمز (SKU)
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                الكمية المتاحة
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                نقطة إعادة الطلب
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                الحالة
              </th>
              {onEdit && (
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr
                key={m.id}
                className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{m.name}</p>
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                  {m.sku ?? '—'}
                </td>

                <td className="px-5 py-4 text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
                  {m.stock_level}
                  {m.unit ? <span className="mr-1 text-xs font-normal text-[var(--color-text-muted)]">{m.unit}</span> : null}
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                  {m.reorder_level ?? '—'}
                </td>

                <td className="px-5 py-4">
                  <OpStatusBadge status={getStockStatus(m)} />
                </td>

                {onEdit && (
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onEdit(m)}
                      aria-label={`تعديل ${m.name}`}
                      title="تعديل المادة"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-accent)] transition hover:bg-[var(--color-accent-subtle)]"
                    >
                      <Pencil size={15} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="border-t border-[var(--color-border)] px-5 py-3">
        <p className="text-sm text-[var(--color-text-muted)]">
          {materials.length} مادة مسجّلة
        </p>
      </div>
    </section>
  )
}
