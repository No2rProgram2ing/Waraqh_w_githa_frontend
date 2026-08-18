import  { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import type { DashboardStats } from '../types/dashboard.types'

interface Props {
  data?: DashboardStats | null
}

export function DashboardSalesChart({ data }: Props) {
  const timeseries = data?.sales_timeseries ?? []

  const categories = useMemo(
    () => timeseries.map((point) => point.date),
    [timeseries],
  )

  const seriesData = useMemo(
    () => [
      {
        name: 'الإيرادات',
        data: timeseries.map((point) => point.revenue),
      },
    ],
    [timeseries],
  )

  const options = useMemo(
    () => ({
      chart: {
        id: 'sales-timeseries',
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true },
      },
      stroke: {
        curve: 'smooth' as const,
        width: 3,
      },
      xaxis: {
        categories,
        labels: {
          rotate: -45,
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) =>
            value.toLocaleString('ar-SA'),
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) =>
            `${value.toLocaleString('ar-SA')} ر.س`,
        },
      },
      colors: ['#6B8E23'],
      grid: {
        borderColor: '#ebe8e1',
      },
      dataLabels: {
        enabled: false,
      },
    }),
    [categories],
  )

  if (timeseries.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e6e2d8] bg-[#f8f6f1] p-6 text-center">
        <div className="mb-2 text-lg font-semibold">
          أداء المبيعات للمنتجات الحرفية — آخر 30 يوم
        </div>

        <p className="text-sm text-[#6d6d6d]">
          لا توجد بيانات زمنية كافية لعرض المخطط.
          يرجى تزويد الخدمة ببيانات المبيعات اليومية.
        </p>
      </div>
    )
  }

  const revenues = timeseries.map((point) => point.revenue)

  return (
    <div className="rounded-2xl border border-[#e6e2d8] bg-[#f8f6f1] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            أداء المبيعات للمنتجات الحرفية
          </h3>

          <p className="text-sm text-[#6d6d6d]">
            آخر {timeseries.length} يوم
          </p>
        </div>

        <div className="text-right">
          <div className="text-xl font-extrabold text-[#1e241d]">
            {data?.total_revenue
              ? `${Number(data.total_revenue).toLocaleString('ar-SA')} ر.س`
              : ''}
          </div>
        </div>
      </div>

      <div>
        <ReactApexChart
          options={options}
          series={seriesData}
          type="area"
          height={260}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-[#6d6d6d]">
        <div className="text-center">
          نقطة عالية:{' '}
          {Math.max(...revenues).toLocaleString('ar-SA')} ر.س
        </div>

        <div className="text-center">
          نقطة منخفضة:{' '}
          {Math.min(...revenues).toLocaleString('ar-SA')} ر.س
        </div>

        <div className="text-center">
          مجموع:{' '}
          {revenues
            .reduce((sum, revenue) => sum + revenue, 0)
            .toLocaleString('ar-SA')}{' '}
          ر.س
        </div>
      </div>
    </div>
  )
}