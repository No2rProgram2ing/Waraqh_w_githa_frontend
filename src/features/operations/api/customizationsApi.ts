import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { CustomizationOption, CustomizationEstimate } from '../types/customizations.types'

export const customizationsApi = {
  // 1. جلب قائمة التخصيصات
  async list(params: Record<string, any> = {}): Promise<{ data: CustomizationOption[] }> {
    const resp = await axiosAdminClient.get('/admin/customizations', { params })
    return resp.data
  },

  // 2. جلب تفاصيل تخصيص محدد
  async getById(id: number): Promise<CustomizationOption> {
    const resp = await axiosAdminClient.get(`/admin/customizations/${id}`)
    return resp.data
  },

  // 3. حساب التكلفة التقديرية
  async estimate(payload: Record<string, any>): Promise<CustomizationEstimate> {
    try {
      const resp = await axiosAdminClient.post('/admin/customizations/estimate', payload)
      return resp.data.data ?? resp.data
    } catch (err: any) {
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

  // 4. إنشاء تخصيص جديد
  async create(payload: FormData | Record<string, any>): Promise<CustomizationOption> {
    const isFormData = payload instanceof FormData
    const resp = await axiosAdminClient.post('/admin/customizations', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
    return resp.data
  },

  // 5. حفظ المسودة
  async saveDraft(id: number | null, payload: Record<string, any>) {
    try {
      if (id) {
        const resp = await axiosAdminClient.put(`/admin/customizations/${id}`, payload)
        return resp.data
      }
      const resp = await axiosAdminClient.post('/admin/customizations/drafts', payload)
      return resp.data
    } catch (err: any) {
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
        throw err
      }
    }
  },
}