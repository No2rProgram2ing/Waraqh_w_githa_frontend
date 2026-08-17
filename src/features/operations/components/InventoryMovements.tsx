import React from 'react'
import type { StockMovement } from '../types/inventory.types'
import { useMovements, useAdjustStock } from '../hooks/useInventory'

export function InventoryMovements({ params = {} }: { params?: Record<string, any> }){
  const { data, isLoading, refetch } = useMovements(params)
  const movements: StockMovement[] = data?.data ?? []
  const adjust = useAdjustStock()

  const handleAdjust = async () => {
    const materialId = Number(prompt('أدخل id المادة لتعديل المخزون:'))
    const change = Number(prompt('أدخل مقدار التغيير (مثال: -5 أو 10):'))
    if (!materialId || isNaN(change)) return alert('بيانات غير صحيحة')
    try {
      await adjust.mutateAsync({ material_id: materialId, change, reason: 'manual_adjust' })
      alert('تم تعديل المخزون (محلي/سيرفر)')
      refetch()
    } catch (err) {
      console.error(err)
      alert('فشل تعديل المخزون')
    }
  }

  if (isLoading) return <div className="p-4">جارٍ تحميل حركات المخزون...</div>

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">سجل حركات المخزون</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} className="rounded-md border px-3 py-1">تحديث</button>
          <button onClick={handleAdjust} className="rounded-md bg-[#3b6a2b] px-3 py-1 text-white">تعديل كمية</button>
        </div>
      </div>

      {movements.length === 0 ? (
        <div className="text-sm text-gray-500">لا توجد حركات.</div>
      ) : (
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="text-[#6d6d6d]"><th className="p-2">المادة</th><th>التغيير</th><th>السبب</th><th>المسؤول</th><th>التاريخ</th></tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{(m as any).material_name ?? m.material_id}</td>
                <td className={`p-2 ${m.change < 0 ? 'text-red-600' : 'text-emerald-700'}`}>{m.change}</td>
                <td className="p-2">{m.reason ?? '-'}</td>
                <td className="p-2">{(m as any).actor ?? '-'}</td>
                <td className="p-2">{m.created_at ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
