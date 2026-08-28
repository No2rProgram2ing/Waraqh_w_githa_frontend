import  { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useOrders, useOrder } from '../hooks/useOrders'
import { OrdersTable } from '../components/OrdersTable'
import { OrderDetailsDrawer } from '../components/OrderDetailsDrawer'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'

export default function OrdersPage() {
  const [params ] = useState<Record<string, any>>({
    per_page: 10,
    page: 1,
  })

  const { data, isLoading } = useOrders(params)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: selectedOrder } = useOrder(selectedId)

  const orders = data?.data ?? []

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>إدارة الطلبات — لوحة الإدارة</title>
      </Helmet>

      <PageHeader title="إدارة الطلبات" />

      <div>
        {isLoading ? (
          <EmptyState>جارٍ تحميل الطلبات...</EmptyState>
        ) : (
          <OrdersTable
            orders={orders}
            onOpen={(id) => setSelectedId(id)}
          />
        )}

        {selectedId && (
          <OrderDetailsDrawer
            order={selectedOrder ?? null}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      <p className="text-sm text-[var(--color-text-muted)]">
        عرض {orders.length} من {data?.meta?.total ?? orders.length} طلب
      </p>
    </div>
  )
}
