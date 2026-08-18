import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useOrders, useOrder } from '../hooks/useOrders'
import { OrdersTable } from '../components/OrdersTable'
import { OrderDetailsDrawer } from '../components/OrderDetailsDrawer'

export default function OrdersPage() {
  const [params, setParams] = useState<Record<string, any>>({ per_page: 10, page: 1 })
  const { data, isLoading } = useOrders(params)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: selectedOrder } = useOrder(selectedId)

  const orders = data?.data ?? []

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>إدارة الطلبات — لوحة الإدارة</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
      </div>

      <div>
        {isLoading ? (
          <div className="text-sm text-[#6d6d6d]">جارٍ تحميل الطلبات...</div>
        ) : (
          <OrdersTable orders={orders} onOpen={(id) => setSelectedId(id)} />
        )}

        {selectedId && <OrderDetailsDrawer order={selectedOrder ?? null} onClose={() => setSelectedId(null)} />}
      </div>

      <div className="text-sm text-[#6d6d6d]">{`عرض ${orders.length} من ${data?.meta?.total ?? orders.length} طلب`}</div>
    </div>
  )
}
