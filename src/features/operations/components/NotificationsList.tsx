import { useMemo, useState } from 'react'
import type { NotificationItem } from '../types/notification.types'
import { Bell } from 'lucide-react'
import { OpButton } from './OpButton'
import { OpSearch } from './OpSearch'
import { OpPagination } from './OpPagination'

interface NotificationsListProps { items: NotificationItem[]; onMarkRead: (ids: number[]) => void }
const PAGE_SIZE = 10

export function NotificationsList({ items, onMarkRead }: NotificationsListProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [page, setPage] = useState(1)
  const toggle = (id: number) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((it) => {
      const matchesSearch = !q || [it.title, it.message].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      const matchesRead = !readFilter || (readFilter === 'read' ? it.read : !it.read)
      return matchesSearch && matchesRead
    })
  }, [items, search, readFilter])
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const allSelected = pageItems.length > 0 && pageItems.every((it) => selected.includes(it.id))
  const toggleAll = () => setSelected((current) => allSelected ? current.filter((id) => !pageItems.some((it) => it.id === id)) : [...new Set([...current, ...pageItems.map((it) => it.id)])])

  if (!items.length) {
    return <div className="flex flex-col items-center justify-center px-5 py-16 text-center"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-subtle)]"><Bell size={24} className="text-[var(--color-text-muted)]" /></div><p className="text-sm font-medium text-[var(--color-text-muted)]">لا توجد إشعارات لعرضها.</p></div>
  }

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 className="text-base font-bold text-[var(--color-text-primary)]">قائمة الإشعارات</h2><p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{selected.length ? `${selected.length} إشعار محدد` : 'حدد إشعارات ثم اضغط «ضع علامة كمقروء»'}</p></div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <OpSearch value={search} onChange={(value) => { setPage(1); setSearch(value) }} placeholder="ابحث في الإشعارات..." className="w-full sm:w-64" />
          <select value={readFilter} onChange={(e) => { setPage(1); setReadFilter(e.target.value) }} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]" aria-label="فلترة الإشعارات">
            <option value="">كل الإشعارات</option><option value="unread">غير مقروء</option><option value="read">مقروء</option>
          </select>
          <OpButton id="notifications-mark-read-btn" onClick={() => onMarkRead(selected)} disabled={!selected.length} size="sm">ضع علامة كمقروء</OpButton>
        </div>
      </div>

      {!pageItems.length ? <div className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">لا توجد نتائج مطابقة.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-right"><thead className="bg-[var(--color-surface-subtle)]"><tr className="border-b border-[var(--color-border)]"><th className="w-12 px-5 py-3.5"><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="تحديد الكل" className="h-4 w-4 cursor-pointer rounded accent-[var(--color-accent)]" /></th><th className="px-5 py-3.5 text-xs font-semibold text-[var(--color-text-muted)]">الإشعار</th><th className="px-5 py-3.5 text-xs font-semibold text-[var(--color-text-muted)]">الوقت</th><th className="px-5 py-3.5 text-xs font-semibold text-[var(--color-text-muted)]">الحالة</th></tr></thead><tbody>{pageItems.map((it) => <tr key={it.id} className={`border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-subtle)] ${it.read ? 'opacity-60' : ''}`}><td className="px-5 py-4"><input type="checkbox" checked={selected.includes(it.id)} onChange={() => toggle(it.id)} aria-label={`تحديد الإشعار: ${it.title}`} className="h-4 w-4 cursor-pointer rounded accent-[var(--color-accent)]" /></td><td className="px-5 py-4"><p className="text-sm font-semibold text-[var(--color-text-primary)]">{it.title}</p>{it.message && <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{it.message}</p>}</td><td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{it.created_at ?? '—'}</td><td className="px-5 py-4"><span className={it.read ? 'inline-flex rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)]' : 'inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 ring-1 ring-blue-300 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-700/60'}>{it.read ? 'مقروء' : 'جديد'}</span></td></tr>)}</tbody></table></div>}

      <OpPagination currentPage={page} lastPage={lastPage} total={filtered.length} shown={pageItems.length} label="إشعار" onPageChange={setPage} />
    </div>
  )
}
