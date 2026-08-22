import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { Payment, PaymentsListResponse, PaymentStatus } from '../types/payments.types'

function normalize(raw: any): Payment {
  const p = raw?.data && !raw.id ? raw.data : raw
  const order = p.order ?? {}

  return {
    ...p,
    id: Number(p.id),
    order_id: order.id ?? p.order_id,
    order_number: order.number ?? p.order_number ?? '-',
    customer_name: p.customer_name ?? order.customer?.full_name ?? order.customer?.name ?? '-',
    amount: Number(p.amount ?? 0),
    method: p.method ?? p.payment_method ?? '-',
    status: p.status?.value ?? p.status ?? 'unpaid',
    // Backend currently exposes created_at, not a separate paid_at field.
    paid_at: p.paid_at ?? (p.status === 'paid' ? p.created_at : null),
    created_at: p.created_at ?? null,
  }
}

export const paymentsApi = {
  async list(params: Record<string, unknown> = {}): Promise<PaymentsListResponse> {
    const r = await axiosAdminClient.get('/admin/payments', { params })
    return {
      ...r.data,
      data: Array.isArray(r.data?.data) ? r.data.data.map(normalize) : [],
    }
  },

  async getById(id: number): Promise<Payment> {
    const r = await axiosAdminClient.get(`/admin/payments/${id}`)
    return normalize(r.data)
  },

  async updateStatus(id: number, status: PaymentStatus, admin_note?: string) {
    await axiosAdminClient.put(`/admin/payments/${id}/status`, { status, admin_note })
  },

  async delete(id: number) {
    return axiosAdminClient.delete(`/admin/payments/${id}`)
  },
}
