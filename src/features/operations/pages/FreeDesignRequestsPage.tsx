import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { OpButton } from '../components/OpButton'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpSearch } from '../components/OpSearch'
import { OpPagination } from '../components/OpPagination'
import { FreeDesignList } from '../components/FreeDesignList'
import { useDeleteFreeDesign, useFreeDesigns } from '../hooks/useFreeDesigns'

export default function FreeDesignRequestsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const query = useFreeDesigns({ page, per_page: 15, search: search || undefined, status: status || undefined })
  const remove = useDeleteFreeDesign()
  const items = query.data?.data ?? []
  const meta = query.data?.meta

  const deleteItem = (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف طلب التصميم هذا؟')) return
    remove.mutate(id)
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>طلبات التصميم الحر — لوحة الإدارة</title></Helmet>
      <OpPageHeader title="طلبات التصميم الحر" description="مراجعة وإدارة طلبات التصاميم الحرة المقدمة من العملاء" action={<><OpButton size="sm" variant="primary" onClick={() => navigate('/admin/free-design-requests/new')}>+ تصميم جديد</OpButton><OpButton size="sm" onClick={() => void query.refetch()} icon={<RefreshCw className={query.isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />}>تحديث</OpButton></>} />

      <OpCard variant="table">
        <OpCardSection className="items-stretch">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <OpSearch value={search} onChange={(value) => { setPage(1); setSearch(value) }} placeholder="ابحث عن العميل أو الوصف..." className="w-full sm:max-w-[430px]" />
            <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]" aria-label="فلترة حالة الطلب">
              <option value="">جميع الحالات</option><option value="new">جديد</option><option value="in_review">قيد المراجعة</option><option value="quoted">تم التسعير</option><option value="converted">تم التحويل</option><option value="rejected">مرفوض</option>
            </select>
            <span className="mr-auto whitespace-nowrap rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs text-[var(--color-text-muted)]">{meta?.total ?? items.length} طلب</span>
          </div>
        </OpCardSection>

        {query.isLoading ? <OpEmptyState>جاري تحميل الطلبات...</OpEmptyState> : query.isError ? <OpEmptyState tone="error">تعذر تحميل طلبات التصميم.</OpEmptyState> : items.length ? <FreeDesignList items={items} onView={(id) => navigate(`/admin/free-design-requests/${id}`)} onEdit={(id) => navigate(`/admin/free-design-requests/${id}`)} onDelete={deleteItem} /> : <OpEmptyState>لا توجد طلبات تصميم حر مطابقة.</OpEmptyState>}

        {!query.isLoading && meta && <OpPagination currentPage={meta.current_page ?? page} lastPage={meta.last_page ?? 1} total={meta.total} shown={items.length} label="طلب" onPageChange={setPage} />}
      </OpCard>
    </div>
  )
}
