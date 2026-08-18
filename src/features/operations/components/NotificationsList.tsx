import React, { useState } from 'react'
import type { NotificationItem } from '../types/notification.types'

export function NotificationsList({ items, onMarkRead }: { items: NotificationItem[]; onMarkRead: (ids: number[]) => void }){
  const [selected, setSelected] = useState<number[]>([])

  const toggle = (id: number) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  if (!items.length) return <div className="p-4">لا توجد إشعارات.</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm">اختر إشعارات ثم اضغط "ضع علامة كمقروء"</div>
        <div>
          <button onClick={() => onMarkRead(selected)} className="rounded-md bg-[#3b6a2b] px-3 py-2 text-white">ضع علامة كمقروء</button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <table className="w-full text-right">
          <thead>
            <tr className="text-sm text-[#6d6d6d]"><th className="p-3"></th><th>العنوان</th><th>الوقت</th></tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className={`border-t ${it.read ? 'opacity-60' : ''}`}>
                <td className="p-3"><input type="checkbox" checked={selected.includes(it.id)} onChange={() => toggle(it.id)} /></td>
                <td className="p-3">{it.title}<div className="text-xs text-gray-500">{it.message}</div></td>
                <td className="p-3 text-sm">{it.created_at ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
