import type { ActivityLogAction, ActivityLogFilters } from '../types/activity-log'

interface ActivityLogFiltersBarProps {
    filters: ActivityLogFilters
    onChange: (filters: ActivityLogFilters) => void
    onReset: () => void
}

export default function ActivityLogFiltersBar({ filters, onChange, onReset }: ActivityLogFiltersBarProps) {
    const hasActiveFilters = !!(filters.search || filters.action || filters.date_from || filters.date_to)

    return (
        <div className="flex flex-wrap items-end gap-3" dir="rtl">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">بحث</label>
                <input
                    type="text"
                    value={filters.search ?? ''}
                    onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
                    placeholder="ابحث بالمستخدم أو الوصف..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                />
            </div>

            <div className="min-w-[150px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">نوع الإجراء</label>
                <select
                    value={filters.action ?? ''}
                    onChange={(e) => onChange({ ...filters, action: e.target.value as ActivityLogAction | '', page: 1 })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                >
                    <option value="">الكل</option>
                    <option value="created">إنشاء</option>
                    <option value="updated">تعديل</option>
                    <option value="deleted">حذف</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">من تاريخ</label>
                <input
                    type="date"
                    value={filters.date_from ?? ''}
                    onChange={(e) => onChange({ ...filters, date_from: e.target.value, page: 1 })}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">إلى تاريخ</label>
                <input
                    type="date"
                    value={filters.date_to ?? ''}
                    onChange={(e) => onChange({ ...filters, date_to: e.target.value, page: 1 })}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
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
