import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import { useDeleteOrder, useOrders } from '../hooks/useOrders'
import { OpButton } from '../components/OpButton'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpSearch } from '../components/OpSearch'
import { OpPagination } from '../components/OpPagination'
import { OrdersTable } from '../components/OrdersTable'
import { OrdersTableSkeleton } from '../components/OrdersTableSkeleton'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

export default function OrdersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { data, isLoading, isFetching, isError, refetch } = useOrders({ page, per_page: 20 })
  const deleteOrder = useDeleteOrder()
  const orders = data?.data ?? []
  const meta = data?.meta

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesSearch = !q || [order.order_number, order.customer?.name, order.type, order.product?.name]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(q))
      return matchesSearch && (!status || String(order.status) === status)
    })
  }, [orders, search, status])

  const handleDelete = (id: number, orderNumber: string | number) => {
    if (!window.confirm(`هل أنت متأكد من حذف الطلب #${orderNumber}؟ لا يمكن التراجع عن هذا الإجراء.`)) return
    deleteOrder.mutate(id, {
      onSuccess: () => {
        showSuccessToast('تم حذف الطلب بنجاح')
      },
      onError: (error: any) => {
        showErrorToast(
          error?.response?.data?.message ||
            'فشل في حذف الطلب، يرجى المحاولة مرة أخرى.',
        )
      },
    })
  }

  return (
    <div dir="rtl" className="space-y-6">
      <OpPageHeader
        title="إدارة الطلبات"
        description="عرض ومتابعة كافة طلبات المبيعات وإدارتها"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <OpButton
              type="button"
              size="sm"
              variant="primary"
              onClick={() => navigate('/admin/orders/create')}
              icon={<Plus className="h-4 w-4" />}
            >
              إضافة طلب
            </OpButton>
            <OpButton type="button" size="sm" onClick={() => void refetch()} icon={<RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />}>
              تحديث
            </OpButton>
          </div>
        }
      />

      <OpCard variant="table">
        <OpCardSection className="items-stretch">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <OpSearch value={search} onChange={(value) => { setPage(1); setSearch(value) }} placeholder="ابحث برقم الطلب أو العميل أو المنتج..." className="w-full sm:max-w-[430px]" />
            <select
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value) }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              aria-label="فلترة حسب الحالة"
            >
              <option value="">جميع الحالات</option>
              <option value="received">مُستلم</option>
              <option value="in_production">قيد التصنيع</option>
              <option value="in_transit">قيد التوصيل</option>
              <option value="cancelled">ملغي</option>
            </select>
            <span className="mr-auto whitespace-nowrap rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs text-[var(--color-text-muted)]">
              {meta?.total ?? orders.length} طلب
            </span>
          </div>
        </OpCardSection>

        {isError ? (
          <OpEmptyState tone="error">
            <p>حدث خطأ أثناء تحميل الطلبات.</p>
            <OpButton type="button" variant="primary" size="sm" className="mt-4" onClick={() => void refetch()}>إعادة المحاولة</OpButton>
          </OpEmptyState>
        ) : isLoading ? (
          <OrdersTableSkeleton />
        ) : filteredOrders.length ? (
          <OrdersTable
            orders={filteredOrders}
            onOpen={(id) => navigate(`/admin/orders/${id}`)}
            onEdit={(id) => navigate(`/admin/orders/${id}`)}
            onDelete={(id) => {
              const order = filteredOrders.find((item) => item.id === id)
              if (order) handleDelete(id, order.order_number)
            }}
            deletingId={deleteOrder.isPending ? deleteOrder.variables : null}
          />
        ) : (
          <OpEmptyState>لا توجد نتائج مطابقة للبحث أو الفلترة.</OpEmptyState>
        )}

        {!isLoading && meta && (
          <OpPagination
            currentPage={meta.current_page ?? page}
            lastPage={meta.last_page ?? 1}
            total={meta.total}
            shown={filteredOrders.length}
            label="طلب"
            onPageChange={setPage}
          />
        )}
      </OpCard>
    </div>
  )
}
