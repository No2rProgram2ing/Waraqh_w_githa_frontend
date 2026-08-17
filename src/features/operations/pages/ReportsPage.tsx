import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useReports } from '../hooks/useReports'
import { ReportsFilters } from '../components/ReportsFilters'
import { ReportsKpiCards } from '../components/ReportsKpiCards'
import { ReportsExport } from '../components/ReportsExport'

export default function ReportsPage(){
  const [filters, setFilters] = useState<Record<string, any>>({})
  const { data, isLoading } = useReports(filters)
  const rows = data?.data ?? []

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>التقارير — لوحة الإدارة</title></Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">التقارير</h1>
        <ReportsExport rows={rows} />
      </div>

      <ReportsFilters from={filters.from} to={filters.to} onChange={(v) => setFilters({ ...filters, ...v })} />

      <div>
        <ReportsKpiCards kpi={data?.kpi ?? null} />
      </div>

      <div>
        {isLoading ? (
          <div className="text-sm text-[#6d6d6d]">جارٍ تحميل التقرير...</div>
        ) : (
          <div className="rounded-2xl border bg-white p-4">
            <table className="w-full text-right">
              <thead>
                <tr className="text-sm text-[#6d6d6d]"><th className="p-3">التاريخ</th><th>الطلبات</th><th>الإيرادات</th><th>متوسط الطلب</th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{r.date}</td>
                    <td className="p-3">{r.orders}</td>
                    <td className="p-3">{Number(r.revenue).toLocaleString('ar-SA')} ر.س</td>
                    <td className="p-3">{r.avg_value ? `${Number(r.avg_value).toLocaleString('ar-SA')} ر.س` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
