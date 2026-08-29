import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, X } from 'lucide-react'
import { useDeleteMaterial, useMaterials } from '../hooks/useInventory'
import { InventoryTable } from '../components/InventoryTable'
import { InventoryForm } from '../components/InventoryForm'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpButton } from '../components/OpButton'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpSearch } from '../components/OpSearch'
import { OpPagination } from '../components/OpPagination'
import { OpModal } from '../components/OpModal'
import type { RawMaterial } from '../types/inventory.types'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

const PAGE_SIZE = 10

export default function InventoryPage() {
  const { data: matData, refetch } = useMaterials({ per_page: 100 })
  const materials = matData?.data ?? []
  const remove = useDeleteMaterial()
  const [editing, setEditing] = useState<RawMaterial | null>(null)
  const [viewing, setViewing] = useState<RawMaterial | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return materials.filter((m: RawMaterial) => {
      const matchesSearch =
        !q ||
        [m.name, m.unit]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(q),
          )

      return (
        matchesSearch &&
        (!status || String(m.status) === status)
      )
    })
  }, [materials, search, status]) 
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (m: RawMaterial) => { setEditing(m); setFormOpen(true) }
  const deleteMaterial = (m: RawMaterial) => {
    if (!window.confirm(`هل أنت متأكد من حذف المادة «${m.name}»؟`)) {
      return
    }

    remove.mutate(m.id, {
      onSuccess: () => {
        showSuccessToast('تم حذف المادة من المخزون بنجاح')
      },
      onError: (error: any) => {
        showErrorToast(
          error?.response?.data?.message ||
            'فشل في حذف المادة، يرجى المحاولة مرة أخرى.',
        )
      },
    })
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>المخزون — لوحة الإدارة</title></Helmet>
      <OpPageHeader title="المخزون والمواد الخام" description="إدارة المواد الخام ومستويات المخزون ونقاط إعادة الطلب" action={<OpButton onClick={openCreate} variant="primary" icon={<Plus size={16} strokeWidth={2.5} />}>إضافة مادة جديدة</OpButton>} />
      <OpCard variant="table">
        <OpCardSection className="items-stretch">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <OpSearch value={search} onChange={(value) => { setPage(1); setSearch(value) }} placeholder="ابحث باسم المادة أو الوحدة..." className="w-full sm:max-w-[400px]" />
            <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]" aria-label="فلترة المخزون">
              <option value="">جميع الحالات</option><option value="in_stock">متوفر</option><option value="low_stock">مخزون منخفض</option><option value="out_of_stock">نفد المخزون</option>
            </select>
            <span className="mr-auto whitespace-nowrap rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs text-[var(--color-text-muted)]">{filtered.length} مادة</span>
          </div>
        </OpCardSection>
        <InventoryTable materials={pageItems} onView={setViewing} onEdit={openEdit} onDelete={deleteMaterial} />
        <OpPagination currentPage={page} lastPage={lastPage} total={filtered.length} shown={pageItems.length} label="مادة" onPageChange={setPage} />
      </OpCard>

      <InventoryForm open={formOpen} material={editing} onClose={() => { setFormOpen(false); setEditing(null) }} onSaved={() => void refetch()} />

      <OpModal open={!!viewing} onClose={() => setViewing(null)} title="تفاصيل المادة" description="بيانات المادة الحالية في المخزون">
        {viewing && <div className="space-y-3 text-sm">
          {[['اسم المادة', viewing.name], ['الوحدة', viewing.unit], ['الكمية المتاحة', viewing.quantity_available], ['نقطة إعادة الطلب', viewing.reorder_point]].map(([label, value]) => <div key={String(label)} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-3"><span className="text-xs text-[var(--color-text-muted)]">{label}</span><strong className="text-[var(--color-text-primary)]">{value}</strong></div>)}
          <div className="flex justify-end pt-2"><OpButton variant="ghost" onClick={() => setViewing(null)} icon={<X size={16} />}>إغلاق</OpButton></div>
        </div>}
      </OpModal>
    </div>
  )
}
