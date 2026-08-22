import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, RefreshCw, Trash2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useOrder, useOrderStatusHistory, useUpdateOrderStatus, useDeleteOrder } from '../hooks/useOrders'
import { OpButton } from '../components/OpButton'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpStatusBadge } from '../components/OpStatusBadge'
import { ProductionStageManager } from '../components/ProductionStageManager'
import type { OrderStatus } from '../types/orders.types'

export default function OrderDetailsPage() {
  const { orderId: orderIdParam } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const orderId = Number(orderIdParam)
  const [statusNote, setStatusNote] = useState('')
  const { data: order, isLoading, isError, refetch, isFetching } = useOrder(Number.isFinite(orderId) ? orderId : null)
  const { data: historyData } = useOrderStatusHistory(Number.isFinite(orderId) ? orderId : null)
  const updateStatus = useUpdateOrderStatus()
  const deleteOrder = useDeleteOrder()

  if (isLoading) return <div dir="rtl" className="min-h-[300px]"><OpEmptyState>جارٍ تحميل تفاصيل الطلب...</OpEmptyState></div>
  if (isError || !order) {
    return (
      <div dir="rtl" className="space-y-4">
        <OpButton variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} icon={<ArrowRight className="h-4 w-4" />}>العودة للطلبات</OpButton>
        <OpEmptyState tone="error">تعذر تحميل الطلب.</OpEmptyState>
      </div>
    )
  }

  const changeStatus = (next: OrderStatus) => {
    const note = window.prompt('ملاحظة تغيير الحالة (اختياري):', statusNote) ?? ''
    setStatusNote(note)
    updateStatus.mutate({ id: order.id, status: next, note })
  }

  const handleDelete = async () => {
    if (!window.confirm(`هل أنت متأكد من حذف الطلب #${order.order_number}؟ لا يمكن التراجع عن هذا الإجراء.`)) return
    await deleteOrder.mutateAsync(order.id)
    navigate('/admin/orders')
  }

  const statusHistory = Array.isArray(historyData?.data) ? historyData.data : (Array.isArray(historyData) ? historyData : [])

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>تفاصيل الطلب #{order.order_number}</title></Helmet>

      <OpPageHeader
        title={`تفاصيل الطلب #${order.order_number}`}
        description="تفاصيل العميل والمنتجات والدفع وحالة الإنتاج"
        action={
          <>
            <OpButton size="sm" onClick={() => void refetch()} icon={<RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />}>تحديث</OpButton>
            <OpButton size="sm" variant="ghost" onClick={() => navigate('/admin/orders')} icon={<ArrowRight className="h-4 w-4" />}>العودة</OpButton>
            <OpButton size="sm" variant="danger" onClick={() => void handleDelete()} disabled={deleteOrder.isPending} icon={<Trash2 className="h-4 w-4" />}>حذف الطلب</OpButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <OpCard>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-bold text-[var(--color-text-primary)]">المنتجات</h2>
                <OpStatusBadge status={String(order.status)} />
              </div>
              <div className="space-y-2">
                {(order.items ?? []).map((it) => (
                  <div key={it.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] p-4">
                    <div>
                      <div className="font-semibold text-[var(--color-text-primary)]">{it.product?.name ?? it.name ?? 'منتج'}</div>
                      <div className="mt-1 text-xs text-[var(--color-text-muted)]">الكمية: {it.quantity}</div>
                      {it.customized && <div className="mt-1 text-xs font-semibold text-[var(--color-accent)]">طلب مخصص</div>}
                    </div>
                    <div className="font-semibold tabular-nums text-[var(--color-text-primary)]">{Number(it.price).toLocaleString('ar-SA')} ر.س</div>
                  </div>
                ))}
              </div>
              {!order.items?.length && <p className="py-6 text-center text-sm text-[var(--color-text-muted)]">لا توجد عناصر في الطلب.</p>}
            </div>
          </OpCard>

          <OpCard>
            <h2 className="mb-4 font-bold text-[var(--color-text-primary)]">مراحل الإنتاج</h2>
            <ProductionStageManager orderId={order.id} />
          </OpCard>

          <OpCard variant="table">
            <OpCardSection>
              <div>
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">سجل حالات الطلب</h2>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">التغييرات المسجلة على حالة الطلب</p>
              </div>
            </OpCardSection>
            {!statusHistory.length ? (
              <OpEmptyState>لا يوجد سجل حالات.</OpEmptyState>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {statusHistory.map((h: any) => (
                  <div key={h.id} className="flex flex-wrap items-start justify-between gap-4 p-4 text-sm">
                    <div>
                      <OpStatusBadge status={String(h.status)} />
                      {h.note && <p className="mt-2 text-[var(--color-text-secondary)]">{h.note}</p>}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">{h.created_at ? new Date(h.created_at).toLocaleString('ar-SA') : '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </OpCard>
        </div>

        <div className="space-y-6">
          <OpCard>
            <div className="space-y-4 text-sm">
              <h2 className="font-bold text-[var(--color-text-primary)]">بيانات الطلب</h2>
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">العميل</span><b>{order.customer?.name ?? '-'}</b></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">رقم الطلب</span><span>{order.order_number}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">نوع الطلب</span><span>{order.type ?? '-'}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">الإجمالي</span><b>{Number(order.total).toLocaleString('ar-SA')} ر.س</b></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">طريقة الدفع</span><span>{order.payment?.method ?? '-'}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-[var(--color-text-muted)]">حالة الدفع</span><OpStatusBadge status={String(order.payment?.status ?? 'unpaid')} /></div>
              <div className="flex justify-between gap-3"><span className="text-[var(--color-text-muted)]">تاريخ الإنشاء</span><span>{order.created_at ? new Date(order.created_at).toLocaleString('ar-SA') : '-'}</span></div>
            </div>
          </OpCard>

          <OpCard>
            <h2 className="mb-3 font-bold text-[var(--color-text-primary)]">تغيير حالة الطلب</h2>
            <select
              value={String(order.status)}
              onChange={(e) => changeStatus(e.target.value as OrderStatus)}
              disabled={updateStatus.isPending}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            >
              <option value="received">مُستلم</option>
              <option value="in_production">قيد التصنيع</option>
              <option value="in_transit">قيد التوصيل</option>
              <option value="cancelled">ملغي</option>
            </select>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">يمكن تغيير الحالة وإضافة ملاحظة للسجل.</p>
          </OpCard>
        </div>
      </div>
    </div>
  )
}
