import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { ReturnRequest, ReturnsListResponse } from '../types/returns.types'

export const returnsApi = {
  async list(params: Record<string, any> = {}): Promise<ReturnsListResponse> {
    try {
      const resp = await axiosAdminClient.get('/admin/returns', { params })
      return resp.data
    } catch (err) {
      // fallback to localStorage
      const key = 'local_returns'
      const raw = localStorage.getItem(key)
      const data = raw ? JSON.parse(raw) : []
      return { data }
    }
  },

  async getById(id: number): Promise<ReturnRequest> {
    try {
      const resp = await axiosAdminClient.get(`/admin/returns/${id}`)
      return resp.data
    } catch (err) {
      const key = 'local_returns'
      const raw = localStorage.getItem(key)
      const data = raw ? JSON.parse(raw) : []
      const found = data.find((r: any) => r.id === id)
      if (!found) throw err
      return found
    }
  },

  async create(payload: FormData) {
    try {
      const resp = await axiosAdminClient.post('/admin/returns', payload, { headers: { 'Content-Type': 'multipart/form-data' } })
      return resp.data
    } catch (err) {
      // fallback: store in localStorage
      const key = 'local_returns'
      const raw = localStorage.getItem(key)
      const existing = raw ? JSON.parse(raw) : []
      const obj: any = { id: Date.now(), status: 'pending', created_at: new Date().toISOString() }
      payload.forEach((v, k) => {
        if (k.endsWith('[]')) {
          const name = k.replace('[]', '')
          if (!obj[name]) obj[name] = []
          obj[name].push(String(v))
        } else {
          obj[k] = String(v as any)
        }
      })
      existing.push(obj)
      localStorage.setItem(key, JSON.stringify(existing))
      return { data: obj }
    }
  }
}
