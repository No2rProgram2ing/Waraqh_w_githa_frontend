import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  lastPage: number
  total: number
  from: number | null
  to: number | null
  itemLabel?: string
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function Pagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  itemLabel = 'عنصر',
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (lastPage <= 1) {
    return null
  }

  const pages = Array.from(
    { length: lastPage },
    (_, index) => index + 1,
  )

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < lastPage

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] px-5 py-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        عرض {from ?? 0} إلى {to ?? 0} من أصل {total} {itemLabel}
      </p>

      <nav
        aria-label="التنقل بين الصفحات"
        className="flex items-center gap-1"
      >
        <button
          type="button"
          disabled={disabled || !canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight size={17} aria-hidden="true" />
        </button>

        {pages.map((page) => {
          const isCurrentPage = page === currentPage

          return (
            <button
              key={page}
              type="button"
              disabled={disabled}
              onClick={() => onPageChange(page)}
              aria-current={isCurrentPage ? 'page' : undefined}
              className={
                isCurrentPage
                  ? 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] px-2.5 text-sm font-semibold text-[var(--color-surface-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'
                  : 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] px-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'
              }
            >
              {page}
            </button>
          )
        })}

        <button
          type="button"
          disabled={disabled || !canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft size={17} aria-hidden="true" />
        </button>
      </nav>
    </div>
  )
}
