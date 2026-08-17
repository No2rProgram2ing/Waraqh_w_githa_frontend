import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { CustomizationDraft, CustomizationEstimate } from '../types/customizations.types'

export const customizationsApi = {
  async estimate(payload: Record<string, any>): Promise<CustomizationEstimate> {
    // Try server-side estimate endpoint if exists
    try {
      const resp = await axiosAdminClient.post('/admin/customizations/estimate', payload)
      return resp.data.data ?? resp.data
    } catch (err: any) {
      // Fallback: do a naive client-side estimate if server endpoint missing
      // This fallback should be replaced by server logic for accuracy
      const basePrice = Number(payload.base_price ?? 0)
      const customizationFee = Number(payload.customization_fee ?? 0)
      const shipping = Number(payload.shipping ?? 0)
      return {
        base_price: basePrice,
        customization_fee: customizationFee,
        shipping,
        total: basePrice + customizationFee + shipping,
      }
    }
  },

  async create(payload: FormData) {
    const resp = await axiosAdminClient.post('/admin/customizations', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return resp.data
  },

  async saveDraft(id: number | null, payload: Record<string, any>) {
    if (id) {
      const resp = await axiosAdminClient.put(`/admin/customizations/${id}`, payload)
      return resp.data
    }
    const resp = await axiosAdminClient.post('/admin/customizations/drafts', payload)
    return resp.data
  },
}
