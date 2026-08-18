import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { FreeDesignRequest } from '../types/freeDesign.types'

export const freeDesignApi = {
  async list(params: Record<string, any> = {}){
    try {
      const resp = await axiosAdminClient.get('/admin/free-designs', { params })
      return resp.data
    } catch (err) {
      const key = 'local_free_designs'
      const raw = localStorage.getItem(key)
      return { data: raw ? JSON.parse(raw) : [] }
    }
  },

  async assign(id: number, payload: Record<string, any> = {}){
    try {
      const resp = await axiosAdminClient.post(`/admin/free-designs/${id}/assign`, payload)
      return resp.data
    } catch (err) {
      // fallback: update localStorage
      const key = 'local_free_designs'
      const raw = localStorage.getItem(key)
      const arr = raw ? JSON.parse(raw) : []
      const idx = arr.findIndex((it: any) => it.id === id)
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...payload }
        localStorage.setItem(key, JSON.stringify(arr))
        return { data: arr[idx] }
      }
      throw err
    }
  }
}
