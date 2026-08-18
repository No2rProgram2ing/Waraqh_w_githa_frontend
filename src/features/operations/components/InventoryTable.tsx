import React from 'react'
import type { RawMaterial } from '../types/inventory.types'

export function InventoryTable({ materials }: { materials: RawMaterial[] }){
  if (!materials.length) return <div className="p-4">لا توجد مواد خام مسجلة.</div>

  return (
    <div className="rounded-2xl border bg-white p-4">
      <table className="w-full text-right">
        <thead>
          <tr className="text-sm text-[#6d6d6d]">
            <th className="p-3">اسم المادة</th>
            <th>رمز</th>
            <th>الكمية المتاحة</th>
            <th>نقطة إعادة الطلب</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.sku ?? '-'}</td>
              <td className={`p-3 font-semibold ${m.stock_level <= (m.reorder_level ?? 0) ? 'text-red-600' : ''}`}>{m.stock_level}</td>
              <td className="p-3">{m.reorder_level ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
