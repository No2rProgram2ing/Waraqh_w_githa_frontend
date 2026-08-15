import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductPaginationProps {
    currentPage: number
    lastPage: number
    total: number
    from: number | null
    to: number | null
    onPageChange: (page: number) => void
    disabled?: boolean
    }

function ProductPagination({
    currentPage,
    lastPage,
    total,
    from,
    to,
    onPageChange,
    disabled = false,
}: ProductPaginationProps) {
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
            عرض {from ?? 0} إلى {to ?? 0} من أصل {total} منتج
        </p>

        <nav
            aria-label="التنقل بين صفحات المنتجات"
            className="flex items-center gap-1"
        >
            <button
            type="button"
            disabled={disabled || !canGoPrevious}
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-40"
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
                    ? 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#45592D] px-2.5 text-sm font-semibold text-white'
                    : 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] px-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-40'
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="الصفحة التالية"
            >
            <ChevronLeft size={17} aria-hidden="true" />
            </button>
        </nav>
        </div>
    )
}

export default ProductPagination