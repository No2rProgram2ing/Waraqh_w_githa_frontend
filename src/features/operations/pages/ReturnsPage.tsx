import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useReturns, useCreateReturn } from '../hooks/useReturns'
import { ReturnsTable } from '../components/ReturnsTable'
import { ReturnDetailsDrawer } from '../components/ReturnDetailsDrawer'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function ReturnsPage() {
  const [params] = useState({ per_page: 20 })
  const { data } = useReturns(params)
  const returnsList = data?.data ?? []
  const createMutation = useCreateReturn()

  const [form, setForm] = useState({
    order_number: '',
    customer_name: '',
    reason: '',
  })

  const [attachments, setAttachments] = useState<File[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const submit = async () => {
    const fd = new FormData()

    fd.append('order_number', form.order_number)
    fd.append('customer_name', form.customer_name)
    fd.append('reason', form.reason)

    attachments.forEach((file) => {
      fd.append('attachments[]', file)
    })

    try {
      await createMutation.mutateAsync(fd)
      alert('تم إنشاء طلب الاستبدال')
    } catch (err) {
      console.error(err)
      alert('حدث خطأ')
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>الاستبدالات — لوحة الإدارة</title>
      </Helmet>

      <PageHeader title="طلبات الاستبدال" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <ReturnsTable
            returnsList={returnsList}
            onOpen={(id) => setSelectedId(id)}
          />
        </div>

        <aside>
          <Card>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              إنشاء طلب استبدال جديد
            </h3>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="رقم الطلب"
                value={form.order_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    order_number: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              />

              <input
                type="text"
                placeholder="اسم العميل"
                value={form.customer_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customer_name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              />

              <textarea
                placeholder="سبب الاستبدال"
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value,
                  })
                }
                rows={4}
                className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              />

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setAttachments(Array.from(e.target.files ?? []))
                }
                className="w-full text-sm text-[var(--color-text-secondary)] file:me-3 file:rounded-lg file:border-0 file:bg-[var(--color-accent-subtle)] file:px-3 file:py-2 file:font-medium file:text-[var(--color-accent)]"
              />

              <Button
                type="button"
                onClick={submit}
                isLoading={createMutation.isPending}
                fullWidth
              >
                إرسال طلب
              </Button>
            </div>
          </Card>
        </aside>
      </div>

      {selectedId && (
        <ReturnDetailsDrawer
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
