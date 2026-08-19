import { useState } from 'react'
import type { NotificationItem } from '../types/notification.types'
import { Bell } from 'lucide-react'

interface NotificationsListProps {
  items: NotificationItem[]
  onMarkRead: (ids: number[]) => void
}

export function NotificationsList({ items, onMarkRead }: NotificationsListProps) {
  const [selected, setSelected] = useState<number[]>([])

  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const toggleAll = () =>
    setSelected(selected.length === items.length ? [] : items.map((i) => i.id))

  if (!items.length) {
    return (
      <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
            <Bell size={24} className="text-[var(--color-text-muted)]" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">لا توجد إشعارات لعرضها.</p>
        </div>
      </div>
    )
  }

  const allSelected = selected.length === items.length && items.length > 0

  return (
    <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">قائمة الإشعارات</h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {selected.length > 0
              ? `${selected.length} إشعار محدد`
              : 'حدد إشعارات ثم اضغط "ضع علامة كمقروء"'}
          </p>
        </div>
        <button
          id="notifications-mark-read-btn"
          onClick={() => onMarkRead(selected)}
          disabled={selected.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition hover:bg-[var(--color-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ضع علامة كمقروء
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-right">
          <thead className="bg-[var(--color-surface)]">
            <tr className="border-b border-[var(--color-border)]">
              <th className="w-12 px-5 py-3.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="تحديد الكل"
                  className="h-4 w-4 cursor-pointer rounded accent-[var(--color-accent)]"
                />
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                الإشعار
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                الوقت
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                الحالة
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr
                key={it.id}
                className={[
                  'border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)]',
                  it.read ? 'opacity-60' : '',
                ].join(' ')}
              >
                {/* Checkbox */}
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(it.id)}
                    onChange={() => toggle(it.id)}
                    aria-label={`تحديد الإشعار: ${it.title}`}
                    className="h-4 w-4 cursor-pointer rounded accent-[var(--color-accent)]"
                  />
                </td>

                {/* Title + Message */}
                <td className="px-5 py-4">
                  <p className={`text-sm font-semibold text-[var(--color-text-primary)] ${!it.read ? '' : 'font-medium'}`}>
                    {it.title}
                  </p>
                  {it.message && (
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{it.message}</p>
                  )}
                </td>

                {/* Time */}
                <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                  {it.created_at ?? '—'}
                </td>

                {/* Read state */}
                <td className="px-5 py-4">
                  {it.read ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)]">
                      مقروء
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 ring-1 ring-blue-300 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-700/60">
                      جديد
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--color-border)] px-5 py-3">
        <p className="text-sm text-[var(--color-text-muted)]">
          {items.length} إشعار · {items.filter((i) => !i.read).length} غير مقروء
        </p>
      </div>
    </section>
  )
}
