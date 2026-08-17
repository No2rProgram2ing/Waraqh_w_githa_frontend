import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { RawMaterial, StockMovement } from '../types/inventory.types'

export const inventoryApi = {
  async listMaterials(params: Record<string, any> = {}){
    const resp = await axiosAdminClient.get('/admin/raw-materials', { params })
    return resp.data
  },

  async getMovements(params: Record<string, any> = {}){
    const resp = await axiosAdminClient.get('/admin/stock-movements', { params })
    return resp.data
  },

  async adjustStock(payload: Record<string, any>){
    const resp = await axiosAdminClient.post('/admin/stock-movements', payload)
    return resp.data
  }
}
