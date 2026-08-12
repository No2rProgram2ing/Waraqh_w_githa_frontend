import { useQuery } from '@tanstack/react-query'
import { activityLogApi } from '../api/activityLogApi'
import type { ActivityLogFilters } from '../types/activity-log'

export const activityLogKeys = {
    all: ['admin', 'activity-logs'] as const,
    list: (filters: ActivityLogFilters) =>
        [...activityLogKeys.all, 'list', filters] as const,
}

export function useActivityLogs(filters: ActivityLogFilters = {}) {
    return useQuery({
        queryKey: activityLogKeys.list(filters),
        queryFn: () => activityLogApi.getAll(filters),
        placeholderData: (prev) => prev, // يحتفظ بالبيانات القديمة أثناء تحميل الصفحة التالية
    })
}
