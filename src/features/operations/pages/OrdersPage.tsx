import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, RefreshCw } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'

import { OpPageHeader } from '../components/OpPageHeader'
import { OpCard } from '../components/OpCard'
import { OrdersTable } from '../components/OrdersTable'
import { OrdersTableSkeleton } from '../components/OrdersTableSkeleton'
import { OrderDetailsDrawer } from '../components/OrderDetailsDrawer'
import type { Order } from '../types/orders.types'

export default function OrdersPage() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: responseData, isLoading, isFetching, isError, refetch } = useOrders({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const orders: Order[] = responseData?.data || (Array.isArray(responseData) ? responseData : [])

  return (
    <div dir="rtl" className="space-y-6">
      {/* 1. هيدر الصفحة */}
      <OpPageHeader
        title="إدارة الطلبات"
        description="عرض ومتابعة كافة طلبات المبيعات الخامات والمنتجات وإدارتها"
        action={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-[#45592D]' : 'text-gray-500'}`} />
              تحديث
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/orders/create')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#384824] transition shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              إنشاء طلب جديد
            </button>
          </div>
        }
      />

      {/* 2. شريط البحث والفلترة */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="ابحث برقم الطلب، اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-xs text-gray-800 placeholder-gray-400 focus:border-[#45592D] focus:ring-1 focus:ring-[#45592D] focus:outline-none transition"
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-700 focus:border-[#45592D] focus:outline-none transition cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">جديد</option>
            <option value="in_production">قيد التصنيع</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
      </div>

      {/* 3. حاوية الجدول */}
      {isError ? (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-600">حدث خطأ أثناء تحميل البيانات.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-xl bg-[#45592D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#384824] transition shadow-sm cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
          <OpCard variant="table">
            {isLoading ? (
              <OrdersTableSkeleton />
            ) : (
              <OrdersTable
                orders={orders}
                onViewDetails={(order: Order) => setSelectedOrder(order)}
              />
            )}
          </OpCard>
        </div>
      )}

      {/* 4. النافذة الجانبية للتفاصيل */}
      <OrderDetailsDrawer
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onOpenChange={(open: boolean) => !open && setSelectedOrder(null)}
      />
    </div>
  )
}