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
    // Prefer server-side draft saving, but gracefully fallback to localStorage when backend is unavailable.
    try {
      if (id) {
        const resp = await axiosAdminClient.put(`/admin/customizations/${id}`, payload)
        return resp.data
      }
      const resp = await axiosAdminClient.post('/admin/customizations/drafts', payload)
      return resp.data
    } catch (err: any) {
      // Fallback: save draft to localStorage and return a pseudo-response so UI can continue working offline
      try {
        const key = 'local_customization_drafts'
        const existingJson = localStorage.getItem(key)
        const existing = existingJson ? JSON.parse(existingJson) : []
        const draft = {
          id: Date.now(),
          ...payload,
          _local: true,
          created_at: new Date().toISOString(),
        }
        existing.push(draft)
        localStorage.setItem(key, JSON.stringify(existing))
        return { data: draft }
      } catch (storageErr) {
        // If even localStorage fails, rethrow original error
        throw err
      }
    }
  },
}
