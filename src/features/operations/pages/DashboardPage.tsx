import { Helmet } from 'react-helmet-async'
import { PageHeader } from '@/components/shared/PageHeader'
import { useDashboardStats, useLatestOrders, useFeaturedProducts } from '../hooks/useDashboard'
import { DashboardKpiCard } from '../components/DashboardKpiCard'
import { DashboardSalesChart } from '../components/DashboardSalesChart'
import { LatestOrders } from '../components/LatestOrders'
import { FeaturedProductsCarousel } from '../components/FeaturedProductsCarousel'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: orders } = useLatestOrders(5)
  const { data: products } = useFeaturedProducts(6)

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>نظرة عامة — لوحة الإدارة</title>
      </Helmet>

      <PageHeader
        title="نظرة عامة"
        description="ملخص سريع لأداء المتجر والعمليات الحالية"
      />

      <section aria-label="مؤشرات الأداء">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        </div>
      </section>

      <section
        aria-label="آخر العمليات والمنتجات المميزة"
        className="grid grid-cols-1 gap-6 xl:grid-cols-2"
      >
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            آخر الطلبات
          </h2>

          <div className="mt-3">
            <LatestOrders orders={orders} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            المنتجات المميزة
          </h2>

          <div className="mt-3">
            <FeaturedProductsCarousel products={products} />
          </div>
        </div>
      </section>

      <section aria-label="مبيعات المتجر">
        <DashboardSalesChart data={stats ?? null} />
      </section>
    </div>
  )
}
