import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { ProductionStage } from '../types/orders.types'

export const productionApi = {
  async getStages(): Promise<Array<{ id: number; name: string; sort_order: number }>> {
    const response = await axiosAdminClient.get('/admin/production-stages', {
      params: { per_page: 100 },
    })

    const rows = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : []

    return rows
      .map((stage: any) => ({
        id: Number(stage.id),
        name: String(stage.name ?? `مرحلة ${stage.id}`),
        sort_order: Number(stage.sort_order ?? 0),
      }))
      .sort((a, b) => a.sort_order - b.sort_order)
  },

  async getHistory(orderId: number): Promise<{ data: ProductionStage[] }> {
    const [historyResponse, stagesResponse] = await Promise.all([
      axiosAdminClient.get(`/admin/orders/${orderId}/production-history`),
      axiosAdminClient.get('/admin/production-stages', { params: { per_page: 100 } }),
    ])

    const history = Array.isArray(historyResponse.data)
      ? historyResponse.data
      : historyResponse.data?.data ?? []

    const stages = Array.isArray(stagesResponse.data?.data)
      ? stagesResponse.data.data
      : []

    // The current OrderResource does not expose current_production_stage.
    // The latest history entry is therefore the source of truth for the UI.
    const latestHistory = [...history].sort(
      (a: any, b: any) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
    )[0]

    const currentId = latestHistory
      ? Number(latestHistory.stage_id ?? latestHistory.stage?.id)
      : null

    return {
      data: stages
        .sort((a: any, b: any) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
        .map((s: any) => ({
          id: Number(s.id),
          key: String(s.id),
          name: String(s.name ?? `مرحلة ${s.id}`),
          status:
            Number(s.id) === currentId
              ? 'in_progress'
              : history.some((h: any) => Number(h.stage_id ?? h.stage?.id) === Number(s.id))
                ? 'done'
                : 'pending',
          date: history.find((h: any) => Number(h.stage_id ?? h.stage?.id) === Number(s.id))?.created_at ?? null,
        })),
    }
  },

  async updateStage(orderId: number, stageId: number) {
    const response = await axiosAdminClient.post(`/admin/orders/${orderId}/stage/${stageId}`, { stage_id: stageId })
    return response.data
  },

  async nextStage(orderId: number) {
    const response = await axiosAdminClient.post(`/admin/orders/${orderId}/next-stage`)
    return response.data
  },
}
