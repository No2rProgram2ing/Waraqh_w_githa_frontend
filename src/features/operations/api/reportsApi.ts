import { axiosAdminClient } from '@/api/axiosAdminClient'

export const reportsApi = {
    async exportCsv(params: Record<string, unknown> = {}) {
        const response = await axiosAdminClient.get('/admin/reports/export', {
            params,
            responseType: 'blob',
        })

        return response.data
    },

    async exportPdf(params: Record<string, unknown> = {}) {
        const response = await axiosAdminClient.get('/admin/reports/export', {
            params: {
                ...params,
                type: 'pdf',
            },
            responseType: 'blob',
        })

        return response.data
    },
}