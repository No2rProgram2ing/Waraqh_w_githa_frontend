import type { RawMaterial } from '../types/inventory.types'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableShell } from '@/components/shared/TableShell'

export function InventoryTable({
  materials,
}: {
  materials: RawMaterial[]
}) {
  if (!materials.length) {
    return <EmptyState>لا توجد مواد خام مسجلة.</EmptyState>
  }

  return (
    <TableShell minWidth="700px">
      <thead className="bg-[var(--color-surface)]">
        <tr className="border-b border-[var(--color-border)]">
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            اسم المادة
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            رمز
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            الكمية المتاحة
          </th>
          <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
            نقطة إعادة الطلب
          </th>
        </tr>
      </thead>

      <tbody>
        {materials.map((material) => {
          const isLowStock =
            material.stock_level <= (material.reorder_level ?? 0)

          return (
            <tr
              key={material.id}
              className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]"
            >
              <td className="px-5 py-4 text-sm font-medium text-[var(--color-text-primary)]">
                {material.name}
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {material.sku ?? '—'}
              </td>

              <td
                className={`px-5 py-4 text-sm font-semibold ${
                  isLowStock
                    ? 'text-[var(--color-danger)]'
                    : 'text-[var(--color-text-primary)]'
                }`}
              >
                {material.stock_level}
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {material.reorder_level ?? '—'}
              </td>
            </tr>
          )
        })}
      </tbody>
    </TableShell>
  )
}