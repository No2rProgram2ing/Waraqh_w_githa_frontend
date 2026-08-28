import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { ActivityLogListResponse, ActivityLogFilters } from '../types/activity-log'

export const activityLogApi = {
    async getAll(filters: ActivityLogFilters = {}): Promise<ActivityLogListResponse> {
        const params: Record<string, string | number> = {}

        if (filters.search) params.search = filters.search
        if (filters.action) params.action = filters.action
        if (filters.date_from) params.date_from = filters.date_from
        if (filters.date_to) params.date_to = filters.date_to
        if (filters.page) params.page = filters.page

        const response = await axiosAdminClient.get<ActivityLogListResponse>(
            '/admin/activity-logs', // Placeholder endpoint
            { params }
        )
        return response.data
    },
}
