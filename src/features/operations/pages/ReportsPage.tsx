import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ReportsChart } from '../components/ReportsChart'
import { useReports } from '../hooks/useReports'
import { ReportsExport } from '../components/ReportsExport'
import { ReportsKpiCards } from '../components/ReportsKpiCards'
import { OpPageHeader } from '../components/OpPageHeader'
//import { Search } from 'lucide-react'

export default function ReportsPage() {
  const [params, setParams] = useState({ from: '', to: '' })
  const { data: stats, refetch, isLoading } = useReports(params)
  
  const kpi = {
    total_orders: stats?.paid_orders_count ?? 0,
    total_revenue: stats?.total_revenue ?? 0,
    avg_order_value: stats?.avg_order_value ?? 0,
  }

  useEffect(() => {
    refetch()
  }, [params, refetch])

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>التقارير — لوحة الإدارة</title>
      </Helmet>

      {/* Page Header */}
      <OpPageHeader
        title="التقارير"
        description="استعرض أداء المتجر والإحصائيات وتصدير البيانات"
        action={<ReportsExport rows={stats?.sales_timeseries ?? []} />}
      />

      {/* KPI Cards */}
      <ReportsKpiCards kpi={kpi} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Column (wider) */}
        <div className="lg:col-span-2">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] px-5 py-24 text-center shadow-sm">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">جارٍ تحميل التقارير...</p>
             </div>
          ) : (
            <ReportsChart stats={stats ?? null} />
          )}
        </div>

        {/* Filters Sidebar */}
        <aside>
          <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                تصفية النتائج
              </h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="filter-from"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  من تاريخ
                </label>
                <input
                  id="filter-from"
                  type="date"
                  value={params.from}
                  onChange={(e) => setParams({ ...params, from: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="filter-to"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  إلى تاريخ
                </label>
                <input
                  id="filter-to"
                  type="date"
                  value={params.to}
                  onChange={(e) => setParams({ ...params, to: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
