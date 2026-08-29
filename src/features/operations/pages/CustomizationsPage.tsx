import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { useCustomizations, useDeleteCustomization } from '../hooks/useCustomizations'
import { OpButton } from '../components/OpButton'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpSearch } from '../components/OpSearch'
import { OpPagination } from '../components/OpPagination'
import { OpIconButton } from '../components/OpIconButton'
import { OpStatusBadge } from '../components/OpStatusBadge'
import { useSystemCurrency } from '@/lib/currency'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

const PAGE_SIZE = 10

export default function CustomizationsPage() {
  const nav = useNavigate()
  const { data, isLoading, isFetching, isError, refetch } = useCustomizations()
  const { formatAmount } = useSystemCurrency()
  const remove = useDeleteCustomization()
  const items = data?.data ?? []
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((it) => {
      const values = [it.request_code, it.customer?.name, it.product?.name, it.color, it.design_pattern]
      const matchesSearch = !q || values.filter(Boolean).some((value) => String(value).toLowerCase().includes(q))
      return matchesSearch && (!status || String(it.status) === status)
    })
  }, [items, search, status])
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const deleteItem = (id: number, requestCode: string) => {
    if (
      !window.confirm(
        `هل أنت متأكد من حذف طلب التخصيص ${requestCode}؟ لا يمكن التراجع عن هذا الإجراء.`,
      )
    ) {
      return
    }

    remove.mutate(id, {
      onSuccess: () => {
        showSuccessToast('تم حذف طلب التخصيص بنجاح')
      },
      onError: (error: any) => {
        showErrorToast(
          error?.response?.data?.message ||
            'فشل في حذف طلب التخصيص، يرجى المحاولة مرة أخرى.',
        )
      },
    })
  }

  return (
    <div dir="rtl" className="space-y-6">
      <OpPageHeader title="طلبات التخصيص" description="مراجعة وإدارة طلبات التخصيص المتاحة من الخادم" action={<><OpButton size="sm" variant="primary" onClick={() => nav('/admin/customizations/new')}>+ إضافة تخصيص جديد</OpButton><OpButton size="sm" onClick={() => void refetch()} icon={<RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />}>تحديث</OpButton></>} />

      <OpCard variant="table">
        <OpCardSection className="items-stretch">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <OpSearch value={search} onChange={(value) => { setPage(1); setSearch(value) }} placeholder="ابحث برقم الطلب أو العميل أو المنتج..." className="w-full sm:max-w-[430px]" />
            <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]" aria-label="فلترة حسب الحالة">
              <option value="">جميع الحالات</option>
              <option value="pending_approval">بانتظار الموافقة</option>
              <option value="in_production">قيد التصنيع</option>
              <option value="completed">مكتمل</option>
            </select>
            <span className="mr-auto whitespace-nowrap rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs text-[var(--color-text-muted)]">{filtered.length} طلب</span>
          </div>
        </OpCardSection>

        {isLoading ? <OpEmptyState>جارٍ تحميل طلبات التخصيص...</OpEmptyState> : isError ? <OpEmptyState tone="error">تعذر تحميل طلبات التخصيص.</OpEmptyState> : !pageItems.length ? <OpEmptyState>لا توجد نتائج مطابقة.</OpEmptyState> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-right text-sm">
              <thead className="bg-[var(--color-surface-subtle)] text-xs text-[var(--color-text-muted)]"><tr className="border-b border-[var(--color-border)]">{['الطلب', 'المنتج', 'الكمية', 'اللون', 'النقشة', 'الإجمالي', 'الحالة', 'الإجراء'].map((head) => <th key={head} className="px-5 py-3.5 font-semibold">{head}</th>)}</tr></thead>
              <tbody>
                {pageItems.map((it) => (
                  <tr key={it.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-subtle)]">
                    <td className="px-5 py-4 font-semibold text-[var(--color-text-primary)]">{it.request_code}</td>
                    <td className="px-5 py-4">{it.product?.name ?? '—'}</td>
                    <td className="px-5 py-4">{it.quantity}</td>
                    <td className="px-5 py-4">{it.color ?? '—'}</td>
                    <td className="px-5 py-4">{it.design_pattern ?? '—'}</td>
                    <td className="px-5 py-4 font-semibold">{formatAmount(it.price?.total ?? 0)}</td>
                    <td className="px-5 py-4"><OpStatusBadge status={String(it.status)} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <OpIconButton icon={<Eye size={17} strokeWidth={1.8} />} label="عرض التفاصيل" onClick={() => nav(`/admin/customizations/${it.id}`)} />
                        <OpIconButton icon={<Pencil size={17} strokeWidth={1.8} />} label="تعديل طلب التخصيص" onClick={() => nav(`/admin/customizations/${it.id}`)} />
                        <OpIconButton icon={<Trash2 size={17} strokeWidth={1.8} />} label="حذف طلب التخصيص" tone="danger" onClick={() => deleteItem(it.id, it.request_code)} disabled={remove.isPending && remove.variables === it.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <OpPagination currentPage={page} lastPage={lastPage} total={filtered.length} shown={pageItems.length} label="طلب" onPageChange={setPage} />
      </OpCard>
    </div>
  )
}
