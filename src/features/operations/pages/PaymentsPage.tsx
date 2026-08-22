import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDeletePayment, usePayments, usePayment } from '../hooks/usePayments'
import { PaymentsTable } from '../components/PaymentsTable'
import { PaymentDetailsDrawer } from '../components/PaymentDetailsDrawer'
import { OpPageHeader } from '../components/OpPageHeader'
import { Download } from 'lucide-react'
import { OpButton } from '../components/OpButton'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpSearch } from '../components/OpSearch'
import { OpPagination } from '../components/OpPagination'

function toCsv(rows: any[], columns: string[]) {
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return columns.map(esc).join(',') + '\n' + rows.map((r) => columns.map((c) => esc(r[c])).join(',')).join('\n')
}

export default function PaymentsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [method, setMethod] = useState('')
  const params = { per_page: 20, page }
  const { data, isLoading } = usePayments(params)
  const remove = useDeletePayment()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: selectedPayment } = usePayment(selectedId)
  const payments = data?.data ?? []

  const deletePayment = (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف عملية الدفع؟ لا يمكن التراجع عن هذا الإجراء.')) return
    remove.mutate(id)
  }

  const exportCsv = () => {
    const columns = ['order_number', 'customer_name', 'method', 'amount', 'status', 'paid_at']
    const csv = toCsv(payments.map((p) => ({ order_number: p.order_number, customer_name: p.customer_name, method: p.method, amount: p.amount, status: p.status, paid_at: p.paid_at ?? '' })), columns)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments_${new Date().toISOString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>المدفوعات — لوحة الإدارة</title></Helmet>
      <OpPageHeader title="المدفوعات" description="متابعة جميع المعاملات المالية وحالات الدفع" action={<OpButton size="sm" variant="primary" onClick={exportCsv} icon={<Download size={15} />}>تصدير CSV</OpButton>} />

      <OpCard variant="table">
        <OpCardSection className="items-stretch">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <OpSearch value={search} onChange={(value) => { setPage(1); setSearch(value) }} placeholder="ابحث برقم الطلب أو اسم العميل..." className="w-full sm:max-w-[400px]" />
            <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]" aria-label="فلترة حالة الدفع">
              <option value="">جميع الحالات</option><option value="paid">مدفوع</option><option value="unpaid">غير مدفوع</option><option value="failed">فشل</option>
            </select>
            <select value={method} onChange={(e) => { setPage(1); setMethod(e.target.value) }} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]" aria-label="فلترة طريقة الدفع">
              <option value="">كل طرق الدفع</option><option value="jawali">جوالي</option><option value="jeeb">جيب</option><option value="al_kuraimi">الكريمي</option>
            </select>
            <span className="mr-auto whitespace-nowrap rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs text-[var(--color-text-muted)]">{data?.meta?.total ?? payments.length} دفعة</span>
          </div>
        </OpCardSection>

        <PaymentsTable payments={payments} onOpenDetails={setSelectedId} onDelete={deletePayment} isLoading={isLoading} searchTerm={search} status={status} method={method} />
        {!isLoading && data?.meta && <OpPagination currentPage={data.meta.current_page ?? page} lastPage={data.meta.last_page ?? 1} total={data.meta.total} shown={payments.length} label="دفعة" onPageChange={setPage} />}
      </OpCard>

      {selectedId && <PaymentDetailsDrawer payment={selectedPayment ?? null} onClose={() => setSelectedId(null)} />}
    </div>
  )
}
