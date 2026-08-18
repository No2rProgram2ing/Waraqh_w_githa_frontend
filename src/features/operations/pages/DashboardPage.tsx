import { Helmet } from 'react-helmet-async'
import {
  useDashboardStats,
  useFeaturedProducts,
  useLatestOrders,
} from '../hooks/useDashboard'
import { DashboardKpiCard } from '../components/DashboardKpiCard'
import { DashboardSalesChart } from '../components/DashboardSalesChart'
import { FeaturedProductsCarousel } from '../components/FeaturedProductsCarousel'
import { LatestOrders } from '../components/LatestOrders'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: orders } = useLatestOrders(5)
  const { data: products } = useFeaturedProducts(6)

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>نظرة عامة — لوحة الإدارة</title>
      </Helmet>

      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
          نظرة عامة
        </h1>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          ملخص سريع لأداء المتجر والعمليات الحالية
        </p>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardKpiCard
          title="إجمالي المبيعات"
          value={
            statsLoading
              ? '...'
              : stats?.total_revenue
                ? `${Number(stats.total_revenue).toLocaleString('ar-SA')} ر.س`
                : '---'
          }
          subtitle={
            stats
              ? undefined
              : 'يتطلب endpoint من الباك لإجمالي الإيرادات'
          }
          percent={null}
        />

        <DashboardKpiCard
          title="الطلبات الجديدة"
          value={statsLoading ? '...' : stats?.pending ?? '---'}
        />

        <DashboardKpiCard
          title="طلبات قيد التصنيع"
          value={statsLoading ? '...' : stats?.production ?? '---'}
        />

        <DashboardKpiCard
          title="بانتظار موافقة الجودة"
          value={0}
          subtitle="معلومة غير متوفرة حالياً"
        />
      </section>

      {/* Latest Orders & Featured Products */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)]">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              آخر الطلبات
            </h2>
          </div>

          <div className="p-5">
            <LatestOrders orders={orders} />
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)]">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              المنتجات المميزة
            </h2>
          </div>

          <div className="p-5">
            <FeaturedProductsCarousel products={products} />
          </div>
        </div>
      </section>

      {/* Sales Chart */}
      <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)]">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            أداء المبيعات
          </h2>
        </div>

        <div className="p-5">
          <DashboardSalesChart data={stats ?? null} />
        </div>
      </section>
    </div>
  )
}