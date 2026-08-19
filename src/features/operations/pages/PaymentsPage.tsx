import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { usePayments, usePayment } from '../hooks/usePayments'
import { PaymentsTable, PaymentsToolbar } from '../components/PaymentsTable'
import { PaymentDetailsDrawer } from '../components/PaymentDetailsDrawer'
import { OpPageHeader } from '../components/OpPageHeader'
import { Download } from 'lucide-react'

function toCsv(rows: any[], columns: string[]) {
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const header = columns.map(esc).join(',')
  const body = rows.map((r) => columns.map((c) => esc(r[c])).join(',')).join('\n')
  return header + '\n' + body
}

export default function PaymentsPage() {
  const [params] = useState<Record<string, any>>({ per_page: 10, page: 1 })
  const { data, isLoading } = usePayments(params)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: selectedPayment } = usePayment(selectedId)
  const [search, setSearch] = useState('')

  const payments = data?.data ?? []

  const exportCsv = () => {
    const columns = ['order_number', 'customer_name', 'method', 'amount', 'status', 'paid_at']
    const csv = toCsv(
      payments.map((p) => ({
        order_number: p.order_number,
        customer_name: p.customer_name,
        method: p.method,
        amount: p.amount,
        status: p.status,
        paid_at: p.paid_at ?? '',
      })),
      columns,
    )

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
      <Helmet>
        <title>المدفوعات — لوحة الإدارة</title>
      </Helmet>

      {/* Page Header */}
      <OpPageHeader
        title="المدفوعات"
        description="متابعة جميع المعاملات المالية وحالات الدفع"
        action={
          <button
            id="payments-export-csv-btn"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition hover:bg-[var(--color-surface-subtle)]"
          >
            <Download size={15} strokeWidth={2} aria-hidden="true" />
            تصدير CSV
          </button>
        }
      />

      {/* Payments Card */}
      <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        <PaymentsToolbar search={search} onSearchChange={setSearch} />

        <PaymentsTable
          payments={payments}
          onOpenDetails={(id) => setSelectedId(id)}
          isLoading={isLoading}
          searchTerm={search}
        />

        {/* Footer */}
        {!isLoading && payments.length > 0 && (
          <div className="border-t border-[var(--color-border)] px-5 py-3">
            <p className="text-sm text-[var(--color-text-muted)]">
              عرض {payments.length} من {data?.meta?.total ?? payments.length} مدفوعة
            </p>
          </div>
        )}
      </section>

      {selectedId && (
        <PaymentDetailsDrawer
          payment={selectedPayment?.data ?? null}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
