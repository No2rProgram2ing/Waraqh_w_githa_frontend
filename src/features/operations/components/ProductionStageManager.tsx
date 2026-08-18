import type { OrderProductionStage } from '../types/orders.types'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  useProductionHistory,
  useUpdateProductionStage,
} from '../hooks/useProduction'

function getStageVariant(status: string): BadgeVariant {
  switch (status) {
    case 'done':
      return 'success'
    case 'in_progress':
      return 'warning'
    case 'blocked':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function ProductionStageManager({
  orderId,
}: {
  orderId: number
}) {
  const { data, refetch } = useProductionHistory(orderId)
  const stages: OrderProductionStage[] = data?.data ?? []
  const update = useUpdateProductionStage()

  const handleUpdate = async (stageKey: string, status: string) => {
    try {
      await update.mutateAsync({
        orderId,
        stageKey,
        payload: {
          status,
          date: new Date().toISOString(),
        },
      })

      refetch()
    } catch (err) {
      console.error(err)
      alert('فشل تحديث المرحلة (محلياً سيتم حفظ التغيير)')
      refetch()
    }
  }

  if (!stages.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border-muted)] px-4 py-4 text-sm text-[var(--color-text-muted)]">
        لا توجد مراحل إنتاج لهذا الطلب.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {stages.map((stage) => (
        <div
          key={stage.key}
          className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 text-right">
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">
              {stage.name}
            </div>

            {stage.date && (
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                {new Date(stage.date).toLocaleString('ar-SA')}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStageVariant(stage.status)}>
              {stage.status}
            </Badge>

            {stage.status !== 'in_progress' && stage.status !== 'done' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleUpdate(stage.key, 'in_progress')}
                isLoading={update.isPending}
              >
                بدء
              </Button>
            )}

            {stage.status !== 'done' && (
              <Button
                type="button"
                onClick={() => handleUpdate(stage.key, 'done')}
                isLoading={update.isPending}
              >
                إنهاء
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}