import type { ApexOptions } from 'apexcharts'
import  { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts/core'
import 'apexcharts/line'
import type { DashboardStats } from '../types/dashboard.types'
import { TrendingUp } from 'lucide-react'
import { useSystemCurrency } from '@/lib/currency'

interface ReportsChartProps {
  stats?: DashboardStats | null
}

export function ReportsChart({ stats }: ReportsChartProps) {
  const { formatAmount } = useSystemCurrency()
  const timeseries = stats?.sales_timeseries ?? []

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

  const options = useMemo<ApexOptions>(
    () => ({
      chart: {
        id: 'reports-sales-timeseries',
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true, speed: 600 },
        background: 'transparent',
        fontFamily: 'inherit',
      },
      theme: {
        mode: 'light' as const,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.28,
          opacityTo: 0.02,
          stops: [0, 100],
        },
      },
      stroke: {
        curve: 'smooth' as const,
        width: 2.5,
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: 'var(--color-text-muted)',
            fontSize: '11px',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => formatAmount(value, { maximumFractionDigits: 0 }),
          style: {
            colors: 'var(--color-text-muted)',
            fontSize: '11px',
          },
        },
      },
      tooltip: {
        theme: 'dark' ,
        y: {
          formatter: (value: number) => formatAmount(value),
        },
      },
      colors: ['#45592D'],
      grid: {
        borderColor: 'var(--color-border)',
        strokeDashArray: 4,
        padding: { left: 0, right: 0 },
      },
      dataLabels: { enabled: false },
      markers: {
        size: categories.length === 1 ? 5 : 0,
        colors: ['#45592D'],
        hover: { size: 6 },
      },
    }),
    [categories, formatAmount],
  )

  const revenues = timeseries.map((p) => p.revenue)
  const maxRev = revenues.length ? Math.max(...revenues) : 0
  const minRev = revenues.length ? Math.min(...revenues) : 0

  /* ── Empty state ── */
  if (timeseries.length === 0) {
    return (
      <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[var(--color-text-primary)]">
              أداء المبيعات
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              بناءً على الفترة المحددة
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-text-muted)]">
            <TrendingUp size={18} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            لا توجد بيانات زمنية كافية ضمن هذه الفترة.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">
            أداء المبيعات
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            المنتجات الحرفية ({timeseries.length} أيام)
          </p>
        </div>

        {stats?.total_revenue !== undefined && (
          <div className="text-right" dir="ltr">
            <p className="text-xs text-[var(--color-text-muted)] text-right">الإجمالي للمبيعات</p>
            <p className="text-xl font-extrabold tabular-nums text-[var(--color-text-primary)]">
              {formatAmount(stats.total_revenue)}
            </p>
          </div>
        )}
      </div>

      <div className="px-2 pt-2" dir="ltr">
        <ReactApexChart
          options={options}
          series={seriesData}
          type="area"
          height={260}
          width="100%"
        />
      </div>

      <div className="grid grid-cols-2 divide-x divide-x-reverse divide-[var(--color-border)] border-t border-[var(--color-border)]">
        <div className="px-5 py-3.5 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">أعلى إيراد يومي</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-[var(--color-text-primary)]" dir="ltr">
            {formatAmount(maxRev)}
          </p>
        </div>
        <div className="px-5 py-3.5 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">أدنى إيراد يومي</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-[var(--color-text-primary)]" dir="ltr">
            {formatAmount(minRev)}
          </p>
        </div>
      </div>
    </div>
  )
}
