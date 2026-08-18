import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { ReportsResponse } from '../types/reports.types'

export const reportsApi = {
  async fetch(params: Record<string, any> = {}): Promise<ReportsResponse> {
    const resp = await axiosAdminClient.get('/admin/reports', { params })
    return resp.data
  },

  async exportCsv(params: Record<string, any> = {}) {
    // server-side CSV if available
    try {
      const resp = await axiosAdminClient.get('/admin/reports/export', { params, responseType: 'blob' })
      return resp.data
    } catch (err) {
      // fallback: client-side CSV should be used by the UI if blob not returned
      throw err
    }
  },

  async exportPdf(params: Record<string, any> = {}) {
    // server-side PDF export endpoint (recommended)
    const resp = await axiosAdminClient.get('/admin/reports/export', { params: { ...params, type: 'pdf' }, responseType: 'blob' })
    return resp.data
  },
}
