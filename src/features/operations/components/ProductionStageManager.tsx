import React from 'react'
import type { OrderProductionStage } from '../types/orders.types'
import { useUpdateProductionStage, useProductionHistory } from '../hooks/useProduction'

export function ProductionStageManager({ orderId }: { orderId: number }){
  const { data, refetch } = useProductionHistory(orderId)
  const stages: OrderProductionStage[] = data?.data ?? []
  const update = useUpdateProductionStage()

  const handleUpdate = async (stageKey: string, status: string) => {
    try {
      await update.mutateAsync({ orderId, stageKey, payload: { status, date: new Date().toISOString() } })
      refetch()
    } catch (err) {
      console.error(err)
      alert('فشل تحديث المرحلة (محلياً سيتم حفظ التغيير)')
      // fallback handled by API layer which updates localStorage
      refetch()
    }
  }

  if (!stages || !stages.length) return <div className="text-sm text-gray-500">لا توجد مراحل إنتاج لهذا الطلب.</div>

  return (
    <div className="space-y-2">
      {stages.map((s) => (
        <div key={s.key} className="flex items-center justify-between border rounded p-3">
          <div className="text-right">
            <div className="font-semibold">{s.name}</div>
            <div className="text-xs text-gray-500">{s.date ? new Date(s.date).toLocaleString() : ''}</div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs ${s.status === 'done' ? 'bg-emerald-100 text-emerald-700' : s.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : s.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{s.status}</div>
            {s.status !== 'in_progress' && s.status !== 'done' && (
              <button onClick={() => handleUpdate(s.key, 'in_progress')} className="rounded-md border px-2 py-1 text-xs">بدء</button>
            )}
            {s.status !== 'done' && (
              <button onClick={() => handleUpdate(s.key, 'done')} className="rounded-md bg-emerald-600 px-2 py-1 text-xs text-white">إنهاء</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
