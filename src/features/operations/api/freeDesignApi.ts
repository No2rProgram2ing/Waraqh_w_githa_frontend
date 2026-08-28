import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { FreeDesignRequest } from '../types/freeDesign.types'

export interface FreeDesignListResponse {
  data: FreeDesignRequest[]
  meta?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface AssignFreeDesignPayload {
  assignee: string
  status: 'assigned' | 'in_progress' | 'done' | 'rejected'
}

export interface AssignFreeDesignResponse {
  data: FreeDesignRequest
}

export const freeDesignApi = {
  async list(
    params: Record<string, unknown> = {},
  ): Promise<FreeDesignListResponse> {
    try {
      const resp = await axiosAdminClient.get<FreeDesignListResponse>(
        '/admin/free-designs',
        { params },
      )

      return resp.data
    } catch (err) {
      const key = 'local_free_designs'
      const raw = localStorage.getItem(key)

      return {
        data: raw ? (JSON.parse(raw) as FreeDesignRequest[]) : [],
      }
    }
  },

  async assign(
    id: number,
    payload: AssignFreeDesignPayload,
  ): Promise<AssignFreeDesignResponse> {
    try {
      const resp = await axiosAdminClient.post<AssignFreeDesignResponse>(
        `/admin/free-designs/${id}/assign`,
        payload,
      )

      return resp.data
    } catch (err) {
      const key = 'local_free_designs'
      const raw = localStorage.getItem(key)
      const arr: FreeDesignRequest[] = raw
        ? (JSON.parse(raw) as FreeDesignRequest[])
        : []

      const idx = arr.findIndex((item) => item.id === id)

      if (idx !== -1) {
        arr[idx] = {
          ...arr[idx],
          ...payload,
        }

        localStorage.setItem(key, JSON.stringify(arr))

        return {
          data: arr[idx],
        }
      }

      throw err
    }
  },
}