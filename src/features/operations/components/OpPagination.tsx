import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OpPaginationProps {
  currentPage: number
  lastPage: number
  total?: number
  shown?: number
  label?: string
  onPageChange: (page: number) => void
}

export function OpPagination({ currentPage, lastPage, total, shown, label = 'عنصر', onPageChange }: OpPaginationProps) {
  if (lastPage <= 1) return null

  const pages: number[] = []
  const start = Math.max(1, Math.min(currentPage - 2, lastPage - 4))
  const end = Math.min(lastPage, start + 4)
  for (let page = start; page <= end; page += 1) pages.push(page)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] px-5 py-3">
      <p className="text-xs text-[var(--color-text-muted)]">
        {shown != null ? `عرض ${shown}` : 'عرض النتائج'}{total != null ? ` من ${total} ${label}` : ''}
      </p>

      <nav className="flex items-center gap-1.5" aria-label="التنقل بين الصفحات">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="الصفحة السابقة"
          title="الصفحة السابقة"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={page === currentPage
              ? 'inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-[var(--color-accent)] px-3 text-sm font-semibold text-white shadow-sm'
              : 'inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-3 text-sm text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-subtle)]'}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="الصفحة التالية"
          title="الصفحة التالية"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  )
}
