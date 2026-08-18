import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { QualityReview } from '../types/quality.types'

export const qualityApi = {
  async list(params: Record<string, any> = {}): Promise<{ data: QualityReview[] }>{
    const resp = await axiosAdminClient.get('/admin/quality-reviews', { params })
    return resp.data
  },

  async getById(id: number): Promise<QualityReview> {
    const resp = await axiosAdminClient.get(`/admin/quality-reviews/${id}`)
    return resp.data
  },

  async approve(id: number, payload: Record<string, any> = {}) {
    const resp = await axiosAdminClient.post(`/admin/quality-reviews/${id}/approve`, payload)
    return resp.data
  },

  async reject(id: number, payload: Record<string, any> = {}) {
    const resp = await axiosAdminClient.post(`/admin/quality-reviews/${id}/reject`, payload)
    return resp.data
  },
}
