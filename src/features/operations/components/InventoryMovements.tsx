import type { StockMovement } from '../types/inventory.types'
import { useMovements, useAdjustStock } from '../hooks/useInventory'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableShell } from '@/components/shared/TableShell'

interface InventoryMovementRecord extends StockMovement {
  material_name?: string | null
  actor?: string | null
}

export function InventoryMovements({
  params = {},
}: {
  params?: Record<string, any>
}) {
  const { data, isLoading, refetch } = useMovements(params)
  const movements: InventoryMovementRecord[] = data?.data ?? []
  const adjust = useAdjustStock()

  const handleAdjust = async () => {
    const materialId = Number(
      prompt('أدخل id المادة لتعديل المخزون:'),
    )
    const change = Number(
      prompt('أدخل مقدار التغيير (مثال: -5 أو 10):'),
    )

    if (!materialId || Number.isNaN(change)) {
      alert('بيانات غير صحيحة')
      return
    }

    try {
      await adjust.mutateAsync({ material_id: materialId,change,reason: 'manual_adjust',})

      alert('تم تعديل المخزون (محلي/سيرفر)')
      refetch()
    } catch (err) {
      console.error(err)
      alert('فشل تعديل المخزون')
    }
  }

  if (isLoading) {
    return <EmptyState>جارٍ تحميل حركات المخزون...</EmptyState>
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          سجل حركات المخزون
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
          >
            تحديث
          </Button>

          <Button
            type="button"
            onClick={handleAdjust}
            isLoading={adjust.isPending}
          >
            تعديل كمية
          </Button>
        </div>
      </div>

      {movements.length === 0 ? (
        <EmptyState>لا توجد حركات.</EmptyState>
      ) : (
        <TableShell minWidth="800px">
          <thead className="bg-[var(--color-surface)]">
            <tr className="border-b border-[var(--color-border)]">
              <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
                المادة
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
                التغيير
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
                السبب
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
                المسؤول
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
                التاريخ
              </th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => (
              <tr
                key={movement.id}
                className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]"
              >
                <td className="px-5 py-4 text-sm font-medium text-[var(--color-text-primary)]">
                  {movement.material_name ?? movement.material_id}
                </td>

                <td
                  className={`px-5 py-4 text-sm font-semibold ${
                    movement.change < 0
                      ? 'text-[var(--color-danger)]'
                      : 'text-[var(--color-success)]'
                  }`}
                >
                  {movement.change}
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                  {movement.reason ?? '—'}
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                  {movement.actor ?? '—'}
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">
                  {movement.created_at
                    ? new Date(movement.created_at).toLocaleString('ar-SA')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </Card>
  )
}