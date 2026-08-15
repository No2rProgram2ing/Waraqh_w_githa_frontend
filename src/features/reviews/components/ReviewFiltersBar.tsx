import type { ReviewFilters, ReviewStatus } from '../types/review'

interface ReviewFiltersBarProps {
    filters: ReviewFilters
    onChange: (filters: ReviewFilters) => void
    onReset: () => void
}

export default function ReviewFiltersBar({ filters, onChange, onReset }: ReviewFiltersBarProps) {
    const hasActiveFilters = !!(
        filters.search ||
        filters.status ||
        filters.rating !== '' && filters.rating !== undefined && filters.rating !== null ||
        filters.date_from ||
        filters.date_to
    )

    return (
        <div className="flex flex-wrap items-end gap-3" dir="rtl">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">بحث برقم الطلب، المنتج، أو العميل</label>
                <input
                    type="text"
                    value={filters.search ?? ''}
                    onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
                    placeholder="بحث..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                />
            </div>

            <div className="min-w-[150px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">التقييم</label>
                <select
                    value={filters.rating ?? ''}
                    onChange={(e) => onChange({ ...filters, rating: e.target.value ? Number(e.target.value) : '', page: 1 })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                >
                    <option value="">جميع التقييمات</option>
                    <option value="5">5 نجوم</option>
                    <option value="4">4 نجوم</option>
                    <option value="3">3 نجوم</option>
                    <option value="2">2 نجمة</option>
                    <option value="1">1 نجمة</option>
                </select>
            </div>

            <div className="min-w-[150px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">الحالة</label>
                <select
                    value={filters.status ?? ''}
                    onChange={(e) => onChange({ ...filters, status: e.target.value as ReviewStatus | '', page: 1 })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                >
                    <option value="">الكل</option>
                    <option value="pending">بانتظار المراجعة</option>
                    <option value="published">مقبول</option>
                    <option value="rejected">مرفوض</option>
                </select>
            </div>

            <div className="min-w-[180px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">من تاريخ</label>
                <input
                    type="date"
                    value={filters.date_from ?? ''}
                    onChange={(e) => onChange({ ...filters, date_from: e.target.value, page: 1 })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                />
            </div>

            <div className="min-w-[180px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">إلى تاريخ</label>
                <input
                    type="date"
                    value={filters.date_to ?? ''}
                    onChange={(e) => onChange({ ...filters, date_to: e.target.value, page: 1 })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                />
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
