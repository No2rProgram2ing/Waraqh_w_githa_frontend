import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { usePayments, usePayment } from '../hooks/usePayments'
import { PaymentsTable } from '../components/PaymentsTable'
import { PaymentDetailsDrawer } from '../components/PaymentDetailsDrawer'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/Button'

function toCsv(rows: any[], columns: string[]) {
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const header = columns.map(esc).join(',')
  const body = rows
    .map((r) => columns.map((c) => esc(r[c])).join(','))
    .join('\n')

  return header + '\n' + body
}

export default function PaymentsPage() {
  const [params] = useState<Record<string, any>>({
    per_page: 10,
    page: 1,
  })

  const { data, isLoading } = usePayments(params)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: selectedPayment } = usePayment(selectedId)

  const payments = data?.data ?? []

  const exportCsv = () => {
    const columns = [
      'order_number',
      'customer_name',
      'method',
      'amount',
      'status',
      'paid_at',
    ]

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

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    })

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

      <PageHeader
        title="المدفوعات"
        action={
          <Button onClick={exportCsv}>
            تصدير CSV
          </Button>
        }
      />

      <div>
        {isLoading ? (
          <EmptyState>جارٍ تحميل المدفوعات...</EmptyState>
        ) : (
          <PaymentsTable
            payments={payments}
            onOpenDetails={(id) => setSelectedId(id)}
          />
        )}

        {selectedId && (
          <PaymentDetailsDrawer
            payment={selectedPayment ?? null}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      <p className="text-sm text-[var(--color-text-muted)]">
        عرض {payments.length} من{' '}
        {data?.meta?.total ?? payments.length} مدفوعات
      </p>
    </div>
  )
}
