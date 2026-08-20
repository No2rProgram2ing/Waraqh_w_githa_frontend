import type { ApexOptions } from 'apexcharts'
import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts/core'
import 'apexcharts/line'
import type { DashboardStats } from '../types/dashboard.types'
import { TrendingUp } from 'lucide-react'
import {
  convertYERToCurrency,
  formatCurrency,
  useExchangeRates,
  useSystemCurrency,
} from '@/lib/currency'

interface Props {
  data?: DashboardStats | null
}

export function DashboardSalesChart({ data }: Props) {
  const { formatAmount, currencyCode } = useSystemCurrency()
  const { data: exchangeRates } = useExchangeRates()
  const timeseries = data?.sales_timeseries ?? []

  const categories = useMemo(
    () => timeseries.map((point) => point.date),
    [timeseries],
  )

  const seriesData = useMemo(
    () => [
      {
        name: 'الإيرادات',
        data: timeseries.map((point) =>
          convertYERToCurrency(
            point.revenue,
            currencyCode,
            exchangeRates?.rates,
          ),
        ),
      },
    ],
    [timeseries, currencyCode, exchangeRates?.rates],
  )

  const options = useMemo<ApexOptions>(
    () => ({
      chart: {
        id: 'sales-timeseries',
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
          formatter: (value: number) => formatCurrency(value, currencyCode, { maximumFractionDigits: 0, }),
          style: {
            colors: 'var(--color-text-muted)',
            fontSize: '11px',
          },
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => formatCurrency(value, currencyCode),
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
    [categories, currencyCode],
  )

  const revenues = useMemo(
    () =>
      timeseries.map((point) =>
        convertYERToCurrency(
          point.revenue,
          currencyCode,
          exchangeRates?.rates,
        ),
      ),
    [timeseries, currencyCode, exchangeRates?.rates],
  )

  const total = revenues.reduce((sum, revenue) => sum + revenue, 0)
  const maxRev = revenues.length ? Math.max(...revenues) : 0
  const minRev = revenues.length ? Math.min(...revenues) : 0
  /* ── Empty state ── */
  if (timeseries.length === 0) {
    return (
      <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[var(--color-text-primary)]">
              أداء المبيعات
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              آخر 30 يوم
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-text-muted)]">
            <TrendingUp size={18} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            لا توجد بيانات زمنية كافية لعرض المخطط.
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            سيظهر المخطط تلقائياً بعد تسجيل مبيعات.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
      {/* Card header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">
            أداء المبيعات
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            آخر {timeseries.length} يوم — المنتجات الحرفية
          </p>
        </div>

        {data?.total_revenue && (
          <div className="text-right" dir="ltr">
            <p className="text-xs text-[var(--color-text-muted)] text-right">الإجمالي</p>
            <p className="text-xl font-extrabold tabular-nums text-[var(--color-text-primary)]">
              {formatAmount(data.total_revenue)}
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="px-2 pt-2">
        <ReactApexChart
          options={options}
          series={seriesData}
          type="area"
          height={260}
          width="100%"
        />
      </div>

      {/* Summary metrics row */}
      <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[var(--color-border)] border-t border-[var(--color-border)]">
        <div className="px-5 py-3.5 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">أعلى قيمة</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-[var(--color-text-primary)]" dir="ltr">
            {formatCurrency(maxRev, currencyCode)}
          </p>
        </div>
        <div className="px-5 py-3.5 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">أدنى قيمة</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-[var(--color-text-primary)]" dir="ltr">
            {formatCurrency(minRev, currencyCode)}
          </p>
        </div>
        <div className="px-5 py-3.5 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">مجموع الفترة</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400" dir="ltr">
            {formatCurrency(total, currencyCode)}
          </p>
        </div>
      </div>
    </div>
  )
}