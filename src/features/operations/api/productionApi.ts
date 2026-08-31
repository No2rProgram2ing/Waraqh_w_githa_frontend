import { adminClient } from '@/lib/api/adminClient'
import type {
  ProductionStage,
  ProductionStageDefinition,
} from '../types/orders.types'

export const productionApi = {
  async getStages(): Promise<ProductionStageDefinition[]> {
    const response = await adminClient.get('/admin/production-stages', {
      params: { per_page: 100 },
    })

    const rows = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : []

    return rows
      .map((stage: unknown) => {
        const item = stage as {
          id?: number | string
          name?: string | null
          sort_order?: number | string | null
        }

        return {
          id: Number(item.id),
          name: String(item.name ?? `مرحلة ${item.id}`),
          sort_order: Number(item.sort_order ?? 0),
        }
      })
      .sort(
        (
          a: ProductionStageDefinition,
          b: ProductionStageDefinition,
        ) => a.sort_order - b.sort_order,
      ) 
},

  async createStage(data: {
    name: string
    sort_order: number
  }): Promise<ProductionStageDefinition> {
    const response = await adminClient.post(
      '/admin/production-stages',
      data,
    )

    return response.data?.data ?? response.data
  },

  async updateStageDefinition(
    id: number,
    data: {
      name: string
      sort_order: number
    },
  ): Promise<ProductionStageDefinition> {
    const response = await adminClient.put(
      `/admin/production-stages/${id}`,
      data,
    )

    return response.data?.data ?? response.data
  },

  async deleteStage(id: number): Promise<void> {
    await adminClient.delete(`/admin/production-stages/${id}`)
  },

  async reorderStages(stageIds: number[]): Promise<void> {
    await adminClient.post('/admin/production-stages/reorder', {
      stage_ids: stageIds,
    })
  },
  async getHistory(orderId: number): Promise<{ data: ProductionStage[] }> {
    const [historyResponse, stagesResponse] = await Promise.all([
      adminClient.get(`/admin/orders/${orderId}/production-history`),
      adminClient.get('/admin/production-stages', {
        params: { per_page: 100 },
      }),
    ])

    const history = Array.isArray(historyResponse.data)
      ? historyResponse.data
      : historyResponse.data?.data ?? []

    const stages = Array.isArray(stagesResponse.data?.data)
      ? stagesResponse.data.data
      : []

    const latestHistory = [...history].sort(
      (a: any, b: any) =>
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime(),
    )[0]

    const currentId = latestHistory
      ? Number(latestHistory.stage_id ?? latestHistory.stage?.id)
      : null

    return {
      data: stages
        .sort(
          (a: any, b: any) =>
            Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
        )
        .map((s: any) => ({
          id: Number(s.id),
          key: String(s.id),
          name: String(s.name ?? `مرحلة ${s.id}`),
          status:
            Number(s.id) === currentId
              ? 'in_progress'
              : history.some(
                    (h: any) =>
                      Number(h.stage_id ?? h.stage?.id) === Number(s.id),
                  )
                ? 'done'
                : 'pending',
          date:
            history.find(
              (h: any) =>
                Number(h.stage_id ?? h.stage?.id) === Number(s.id),
            )?.created_at ?? null,
        })),
    }
  },

  async updateStage(orderId: number, stageId: number) {
    const response = await adminClient.post(
      `/admin/orders/${orderId}/stage/${stageId}`,
      { stage_id: stageId },
    )

    return response.data
  },

  async nextStage(orderId: number) {
    const response = await adminClient.post(
      `/admin/orders/${orderId}/next-stage`,
    )

    return response.data
  },
}