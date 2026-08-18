import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import type { DashboardStats } from '../types/dashboard.types'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/shared/EmptyState'

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
        background: 'transparent',
      },
      stroke: {
        curve: 'smooth' as const,
        width: 3,
      },
      xaxis: {
        categories,
        labels: {
          rotate: -45,
          style: {
            colors: 'var(--color-text-muted)',
          },
        },
        axisBorder: {
          color: 'var(--color-border)',
        },
        axisTicks: {
          color: 'var(--color-border)',
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--color-text-muted)',
          },
          formatter: (value: number) =>
            value.toLocaleString('ar-SA'),
        },
      },
      tooltip: {
        theme: 'auto',
        y: {
          formatter: (value: number) =>
            `${value.toLocaleString('ar-SA')} ر.س`,
        },
      },
      colors: ['var(--color-accent)'],
      grid: {
        borderColor: 'var(--color-border)',
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.25,
          opacityTo: 0.02,
        },
      },
    }),
    [categories],
  )

  if (timeseries.length === 0) {
    return (
      <EmptyState className="min-h-[260px] flex-col gap-2">
        <p className="text-lg font-semibold text-[var(--color-text-primary)]">
          أداء المبيعات للمنتجات الحرفية
        </p>

        <p className="text-sm text-[var(--color-text-muted)]">
          لا توجد بيانات زمنية كافية لعرض المخطط.
          يرجى تزويد الخدمة ببيانات المبيعات اليومية.
        </p>
      </EmptyState>
    )
  }

  const revenues = timeseries.map((point) => point.revenue)

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            أداء المبيعات للمنتجات الحرفية
          </h3>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            آخر {timeseries.length} يوم
          </p>
        </div>

        <div className="text-right">
          <div className="text-xl font-extrabold text-[var(--color-text-primary)]">
            {data?.total_revenue
              ? `${Number(data.total_revenue).toLocaleString('ar-SA')} ر.س`
              : ''}
          </div>
        </div>
      </div>

      <ReactApexChart
        options={options}
        series={seriesData}
        type="area"
        height={260}
      />

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-[var(--color-text-secondary)] sm:grid-cols-3">
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
    </Card>
  )
}
