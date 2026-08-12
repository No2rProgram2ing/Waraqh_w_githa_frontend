import type { CustomerFilters, CustomerStatus } from '../types/customer'

interface CustomerFiltersBarProps {
    filters: CustomerFilters
    onChange: (filters: CustomerFilters) => void
    onReset: () => void
}

export default function CustomerFiltersBar({ filters, onChange, onReset }: CustomerFiltersBarProps) {
    const hasActiveFilters = !!(filters.search || filters.status)

    return (
        <div className="flex flex-wrap items-end gap-3" dir="rtl">
            <div className="flex-1 min-w-[250px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">بحث بالاسم أو البريد أو الجوال</label>
                <input
                    type="text"
                    value={filters.search ?? ''}
                    onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
                    placeholder="بحث..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                />
            </div>

            <div className="min-w-[150px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">حالة الحساب</label>
                <select
                    value={filters.status ?? ''}
                    onChange={(e) => onChange({ ...filters, status: e.target.value as CustomerStatus | '', page: 1 })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                >
                    <option value="">الكل</option>
                    <option value="active">نشط</option>
                    <option value="inactive">موقوف</option>
                </select>
            </div>

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onReset}
                    className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] transition-colors"
                >
                    إعادة ضبط
                </button>
            )}
        </div>
    )
}
