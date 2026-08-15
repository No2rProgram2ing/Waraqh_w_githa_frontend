import type { CustomerCategory, CustomerFilters } from '../types/customer'

interface CustomerFiltersBarProps {
    filters: CustomerFilters
    onChange: (filters: CustomerFilters) => void
    onReset: () => void
}

export default function CustomerFiltersBar({ filters, onChange, onReset }: CustomerFiltersBarProps) {
    const hasActiveFilters = !!(filters.search || filters.category || filters.verified !== undefined && filters.verified !== '')

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
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">الفئة</label>
                <select
                    value={filters.category ?? ''}
                    onChange={(e) => onChange({ ...filters, category: e.target.value as CustomerCategory | '', page: 1 })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                >
                    <option value="">الكل</option>
                    <option value="regular">عادي</option>
                    <option value="vip">VIP</option>
                </select>
            </div>

            <div className="min-w-[150px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">الحالة</label>
                <select
                    value={filters.verified === '' ? '' : String(filters.verified ?? '')}
                    onChange={(e) => {
                        const value = e.target.value
                        onChange({
                            ...filters,
                            verified: value === '' ? '' : value === 'true' ? true : false,
                            page: 1,
                        })
                    }}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                >
                    <option value="">الكل</option>
                    <option value="true">مؤكد</option>
                    <option value="false">غير مؤكد</option>
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
