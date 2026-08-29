import { axiosAdminClient } from '@/api/axiosAdminClient'

import type {
  Order,
  OrderItem,
  OrdersListResponse,
  OrderStatus,
  CreateOrderPayload,
} from '../types/orders.types'

function normalizeItem(item: any): OrderItem {
  return {
    id: Number(item?.id ?? 0),

    product: item?.product ?? null,

    name:
      item?.name ??
      item?.product?.name ??
      null,

    quantity: Number(
      item?.quantity ??
        item?.qty ??
        0,
    ),

    qty: Number(
      item?.quantity ??
        item?.qty ??
        0,
    ),

    price: Number(
      item?.price ??
        item?.unit_price ??
        0,
    ),

    customized: Boolean(
      item?.customized ??
        item?.is_customized,
    ),

    customization_id:
      item?.customization_id ??
      null,

    customization_note:
      item?.customization_note ??
      null,
  }
}

function normalizeOrder(raw: any): Order {
  let source = raw

  if (source?.data) {
    source = source.data
  }

  if (source?.data && !source?.id) {
    source = source.data
  }

  source = source ?? {}

  return {
    ...source,

    id: Number(source.id ?? 0),

    order_number: String(
      source.order_number ??
        source.number ??
        source.id ??
        '',
    ),

    type:
      source.type ??
      source.order_type ??
      null,

    total: Number(
      source.total ??
        source.total_amount ??
        0,
    ),

    status:
      source.status?.value ??
      source.status ??
      'received',

    customer: source.customer
      ? {
          id:
            source.customer.id ??
            null,

          name:
            source.customer.name ??
            source.customer.full_name ??
            null,

          phone:
            source.customer.phone ??
            null,
        }
      : {
          id: null,
          name: null,
          phone: null,
        },

    product:
      source.product ??
      source.items?.[0]?.product ??
      null,

    items:
      Array.isArray(source.items)
        ? source.items.map(normalizeItem)
        : [],

    payment: source.payment
      ? {
          id: Number(
            source.payment.id ?? 0,
          ),

          method:
            source.payment.method ??
            null,

          amount: Number(
            source.payment.amount ?? 0,
          ),

          status:
            source.payment.status?.value ??
            source.payment.status ??
            'unpaid',

          paid_at:
            source.payment.paid_at ??
            null,
        }
      : null,

    created_at:
      source.created_at ?? '',
  }
}

export const ordersApi = {
  async list(
    params: {
      page?: number
      per_page?: number
    } = {},
  ): Promise<OrdersListResponse> {
    const response =
      await axiosAdminClient.get(
        '/admin/orders',
        {
          params: {
            per_page: 20,
            ...params,
          },
        },
      )

    const payload = response.data

    const data =
      payload?.data?.data ??
      payload?.data ??
      []

    return {
      ...payload,

      data: Array.isArray(data)
        ? data.map(normalizeOrder)
        : [],
    }
  },

  async getById(
    id: number,
  ): Promise<Order> {
    const response =
      await axiosAdminClient.get(
        `/admin/orders/${id}`,
      )

    return normalizeOrder(
      response.data,
    )
  },

  async create(
    payload: CreateOrderPayload,
  ): Promise<Order> {
    const response =
      await axiosAdminClient.post(
        '/admin/orders',
        payload,
      )

    return normalizeOrder(
      response.data,
    )
  },

  async updateStatus(
    id: number,
    status: OrderStatus,
    note?: string,
  ): Promise<void> {
    await axiosAdminClient.put(
      `/admin/orders/${id}/status`,
      {
        status,
        note,
      },
    )
  },

  async delete(
    id: number,
  ): Promise<void> {
    await axiosAdminClient.delete(
      `/admin/orders/${id}`,
    )
  },

  async getProductionHistory(
    id: number,
  ) {
    const response =
      await axiosAdminClient.get(
        `/admin/orders/${id}/production-history`,
      )

    return response.data
  },

  async getStatusHistory(
    id: number,
  ) {
    const response =
      await axiosAdminClient.get(
        `/admin/orders/${id}/status-history`,
      )

    return response.data
  },
}