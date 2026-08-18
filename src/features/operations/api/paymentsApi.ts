import { axiosAdminClient } from '@/api/axiosAdminClient'
import type {
  Payment,
  PaymentsListResponse,
} from '../types/payments.types'

export interface PaymentDetailResponse {
  data: Payment
}

export const paymentsApi = {
  async list(
    params: Record<string, unknown> = {},
  ): Promise<PaymentsListResponse> {
    const response = await axiosAdminClient.get<PaymentsListResponse>(
      '/admin/payments',
      {
        params,
      },
    )

    return response.data
  },

  async getById(id: number): Promise<PaymentDetailResponse> {
    const response = await axiosAdminClient.get<PaymentDetailResponse>(
      `/admin/payments/${id}`,
    )

    return response.data
  },

  async refund(
    paymentId: number,
    payload: {
      amount?: number
      reason?: string
    } = {},
  ): Promise<PaymentDetailResponse> {
    const response = await axiosAdminClient.post<PaymentDetailResponse>(
      `/admin/payments/${paymentId}/refund`,
      payload,
    )

    return response.data
  },

  async markPaid(paymentId: number): Promise<PaymentDetailResponse> {
    const response = await axiosAdminClient.post<PaymentDetailResponse>(
      `/admin/payments/${paymentId}/mark-paid`,
    )

    return response.data
  },
}