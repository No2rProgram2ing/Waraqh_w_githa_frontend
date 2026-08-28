import { useState } from 'react'
import type { NotificationItem } from '../types/notification.types'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableShell } from '@/components/shared/TableShell'
import { Button } from '@/components/ui/Button'

export function NotificationsList({
  items,
  onMarkRead,
}: {
  items: NotificationItem[]
  onMarkRead: (ids: number[]) => void
}) {
  const [selected, setSelected] = useState<number[]>([])

  const toggle = (id: number) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    )
  }

  if (!items.length) {
    return <EmptyState>لا توجد إشعارات.</EmptyState>
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">
          اختر الإشعارات ثم اضغط على «ضع علامة كمقروء».
        </p>

        <Button
          type="button"
          onClick={() => onMarkRead(selected)}
          disabled={!selected.length}
        >
          ضع علامة كمقروء
        </Button>
      </div>

      <TableShell minWidth="700px">
        <thead className="bg-[var(--color-surface)]">
          <tr className="border-b border-[var(--color-border)]">
            <th className="w-14 px-5 py-4 text-right text-sm font-semibold text-[var(--color-text-secondary)]">
              <span className="sr-only">تحديد</span>
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold text-[var(--color-text-secondary)]">
              العنوان
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold text-[var(--color-text-secondary)]">
              الوقت
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)] ${
                item.read ? 'opacity-60' : ''
              }`}
            >
              <td className="px-5 py-4">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggle(item.id)}
                  aria-label={`تحديد الإشعار: ${item.title}`}
                  className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                />
              </td>

              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  {item.message}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {item.created_at ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>
    </div>
  )
}
