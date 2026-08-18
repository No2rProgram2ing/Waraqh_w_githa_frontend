
interface ProductToolbarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
}

function ProductToolbar({
  searchValue = '',
  onSearchChange,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] p-5">
      <div>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          المنتجات
        </h2>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          قائمة المنتجات المسجلة في النظام
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="البحث عن منتج..."
          className="w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
          aria-label="البحث عن منتج"
        />
      </div>
    </div>
  )
}

export default ProductToolbar