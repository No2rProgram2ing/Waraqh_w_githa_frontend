import type { ProductionStage } from '../types/orders.types'
import { useProductionHistory, useUpdateProductionStage } from '../hooks/useProduction'
import { OpButton } from './OpButton'
import { OpStatusBadge } from './OpStatusBadge'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

export function ProductionStageManager({ orderId }: { orderId: number }) {
  const { data, isLoading, isError } = useProductionHistory(orderId)
  const update = useUpdateProductionStage()
  const stages: ProductionStage[] = data?.data ?? []

  if (isLoading) return <div className="text-sm text-[var(--color-text-muted)]">جارٍ تحميل مراحل الإنتاج...</div>
  if (isError) return <div className="text-sm text-red-600">تعذر تحميل مراحل الإنتاج.</div>
  if (!stages.length) return <div className="text-sm text-[var(--color-text-muted)]">لا توجد مراحل إنتاج معرفة.</div>

  return (
    <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
      {stages.map((s) => {
        const status = s.status === 'done' ? 'completed' : s.status === 'in_progress' ? 'in_progress' : 'pending'
        return (
          <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="font-semibold text-[var(--color-text-primary)]">{s.name}</div>
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">{s.date ? new Date(s.date).toLocaleString('ar-SA') : '—'}</div>
            </div>
            <div className="flex items-center gap-2">
              <OpStatusBadge status={status} label={s.status === 'done' ? 'مكتملة' : s.status === 'in_progress' ? 'جارية' : 'معلقة'} />
              {s.status !== 'done' && (
                <OpButton size="sm" variant="primary" disabled={update.isPending}
                 onClick={() => {
                    update.mutate(
                        {
                          orderId,
                          stageId: s.id,
                        },
                        {
                          onSuccess: () => {
                            showSuccessToast('تم تحديث مرحلة الإنتاج بنجاح')
                          },
                          onError: (error: any) => {
                            showErrorToast(
                              error?.response?.data?.message ||
                                'فشل في تحديث مرحلة الإنتاج، يرجى المحاولة مرة أخرى.',
                            )
                          },
                        },
                      )   
                  }}>
                  {s.status === 'in_progress' ? 'تعيين هذه المرحلة' : 'بدء'}
                </OpButton>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
