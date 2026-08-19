import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useOrders, useOrder } from '../hooks/useOrders'
import { OrdersTable, OrdersToolbar } from '../components/OrdersTable'
import { OrderDetailsDrawer } from '../components/OrderDetailsDrawer'

export default function OrdersPage() {
  const [params, setParams] = useState<Record<string, any>>({ per_page: 10, page: 1 })
  const [search, setSearch] = useState('')
  const { data, isLoading } = useOrders(params)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: selectedOrder } = useOrder(selectedId)

  const orders = data?.data ?? []

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>إدارة الطلبات — لوحة الإدارة</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight text-[var(--color-text-primary)]">
            إدارة الطلبات
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
            إدارة طلبات المتجر ومتابعة حالتها
          </p>
        </div>
      </div>

      {/* Orders Card */}
      <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        <OrdersToolbar search={search} onSearchChange={setSearch} />
        <OrdersTable
          orders={orders}
          onOpen={(id) => setSelectedId(id)}
          isLoading={isLoading}
          searchTerm={search}
        />

        {/* Footer */}
        {!isLoading && orders.length > 0 && (
          <div className="border-t border-[var(--color-border)] px-5 py-3">
            <p className="text-sm text-[var(--color-text-muted)]">
              عرض {orders.length} من {data?.meta?.total ?? orders.length} طلب
            </p>
          </div>
        )}
      </section>

      {selectedId && (
        <OrderDetailsDrawer
          order={selectedOrder ?? null}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
