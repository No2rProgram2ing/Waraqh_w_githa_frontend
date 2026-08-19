import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ReportsChart } from '../components/ReportsChart'
import { useReports } from '../hooks/useReports'
import { ReportsExport } from '../components/ReportsExport'
import { ReportsKpiCards } from '../components/ReportsKpiCards'
import { OpPageHeader } from '../components/OpPageHeader'
import { Search } from 'lucide-react'

export default function ReportsPage() {
  const [params, setParams] = useState({ per_page: 50, q: '' })
  const { data, refetch, isLoading } = useReports(params)
  const rows = data?.data ?? []
  
  // Calculate mock KPIs since the API might not provide them directly yet
  const totalRevenue = rows.reduce((sum: number, r: any) => sum + Number(r.value ?? r.amount ?? 0), 0)
  const totalOrders = rows.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  
  const mockKpi = {
    total_orders: totalOrders,
    total_revenue: totalRevenue,
    avg_order_value: avgOrderValue,
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
        action={<ReportsExport rows={rows} />}
      />

      {/* KPI Cards */}
      <ReportsKpiCards kpi={mockKpi} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Column (wider) */}
        <div className="lg:col-span-2">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] px-5 py-24 text-center shadow-sm">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">جارٍ تحميل التقارير...</p>
             </div>
          ) : (
            <ReportsChart
              rows={rows.map((r: any) => ({
                label: r.name ?? r.label ?? 'عنصر',
                value: r.value ?? r.amount ?? 0,
              }))}
            />
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
                  htmlFor="reports-search"
                  className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  بحث
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-4 w-4 text-[var(--color-text-faint)]" aria-hidden="true" />
                  </div>
                  <input
                    id="reports-search"
                    type="search"
                    placeholder="ابحث في التقارير..."
                    value={params.q}
                    onChange={(e) => setParams({ ...params, q: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-4 pr-10 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
