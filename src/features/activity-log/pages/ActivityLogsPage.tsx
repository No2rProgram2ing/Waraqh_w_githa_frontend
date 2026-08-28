import { useState } from 'react'
import { useActivityLogs } from '../hooks/useActivityLogs'
import ActivityLogTable from '../components/ActivityLogTable'
import ActivityLogFiltersBar from '../components/ActivityLogFiltersBar'
import type { ActivityLogFilters } from '../types/activity-log'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const DEFAULT_FILTERS: ActivityLogFilters = {
    search: '',
    action: '',
    date_from: '',
    date_to: '',
    page: 1,
}

export default function ActivityLogsPage() {
    const [filters, setFilters] = useState<ActivityLogFilters>(DEFAULT_FILTERS)

    const { data, isLoading, isError, refetch } = useActivityLogs(filters)

    const logs = data?.data ?? []
    const meta = data?.meta

    if (isError) {
        return (
            <div dir="rtl" className="space-y-6">
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">سجل النشاط</h1>
                <p className="text-sm text-[var(--color-danger)]">حدث خطأ أثناء تحميل السجل.</p>
                <button
                    onClick={() => void refetch()}
                    className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    إعادة المحاولة
                </button>
            </div>
        )
    }

    return (
        <div dir="rtl" className="space-y-6">
            <div>
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">سجل النشاط</h1>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    تتبع جميع الأحداث والإجراءات التي تمت على النظام
                    {meta && ` — ${meta.total} حدث إجمالاً`}
                </p>
            </div>

            {/* Filters */}
            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5">
                <ActivityLogFiltersBar
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(DEFAULT_FILTERS)}
                />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="text-center py-16 text-sm text-[var(--color-text-muted)]">جاري التحميل...</div>
            ) : (
                <ActivityLogTable logs={logs} />
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between" dir="rtl">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        صفحة {meta.current_page} من {meta.last_page}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={meta.current_page <= 1}
                            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                            className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                            السابق
                        </button>
                        <button
                            disabled={meta.current_page >= meta.last_page}
                            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                            className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            التالي
                            <ChevronLeft size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
