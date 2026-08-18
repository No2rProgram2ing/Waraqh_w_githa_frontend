import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ReportsChart } from '../components/ReportsChart'
import { useReports } from '../hooks/useReports'
import { ReportsExport } from '../components/ReportsExport'
import { PageHeader } from '@/components/shared/PageHeader'

export default function ReportsPage() {
  interface ReportsParams {
  per_page: number
  q?: string
}

const [params, setParams] = useState<ReportsParams>({
  per_page: 50,
})
  const { data, refetch } = useReports(params)
  const rows = data?.data ?? []

  useEffect(() => {
    refetch()
  }, [params, refetch])

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>التقارير — لوحة الإدارة</title>
      </Helmet>

      <PageHeader
        title="التقارير"
        action={<ReportsExport rows={rows} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <ReportsChart
            rows={rows.map((r: any) => ({
              label: r.name ?? r.label ?? 'عنصر',
              value: r.value ?? r.amount ?? 0,
            }))}
          />
        </div>

        <aside>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              فلترة
            </h3>

            <div className="mt-3 space-y-2">
              <input
                type="search"
                placeholder="بحث"
                onChange={(e) =>
                  setParams({
                    ...params,
                    q: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
