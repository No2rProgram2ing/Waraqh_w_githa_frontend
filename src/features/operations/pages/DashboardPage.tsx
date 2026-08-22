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
import {
  TrendingUp,
  ShoppingCart,
  Factory,
  CreditCard,
} from 'lucide-react'
import { useSystemCurrency } from '@/lib/currency'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpPageHeader } from '../components/OpPageHeader'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: orders } = useLatestOrders(5)
  const { data: products } = useFeaturedProducts(6)
  const { formatAmount } = useSystemCurrency()

  return (
    <div dir="rtl" className="space-y-7">
      <Helmet>
        <title>نظرة عامة — لوحة الإدارة</title>
      </Helmet>

      <OpPageHeader
        title="نظرة عامة"
        description="ملخص سريع لأداء المتجر والعمليات الحالية"
      />

      {/* ── KPI Cards ──────────────────────────────────── */}
      <section
        aria-label="المؤشرات الرئيسية"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <DashboardKpiCard
          title="إجمالي المبيعات"
          icon={TrendingUp}
          value={
            statsLoading
              ? '...'
              : stats?.total_revenue !== undefined
                ? formatAmount(stats.total_revenue)
                : '---'
          }
          subtitle={
            stats && stats.total_revenue === undefined && !statsLoading
              ? 'الإيرادات غير مدعومة حالياً من الباك'
              : !stats && !statsLoading
                ? 'يتطلب endpoint من الباك'
                : undefined
          }
          percent={null}
          variant="positive"
        />

        <DashboardKpiCard
          title="الطلبات الجديدة"
          icon={ShoppingCart}
          value={statsLoading ? '...' : stats?.pending ?? '---'}
          variant="positive"
        />

        <DashboardKpiCard
          title="قيد التصنيع"
          icon={Factory}
          value={statsLoading ? '...' : stats?.production ?? '---'}
          variant="warning"
        />

        <DashboardKpiCard
          title="الطلبات المدفوعة"
          icon={CreditCard}
          value={statsLoading ? '...' : stats?.paid_orders_count ?? '---'}
          variant="normal"
        />
      </section>

      {/* ── Analytics & Orders Row ─────────────────────── */}
      <section
        aria-label="التحليلات وآخر الطلبات"
        className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      >
        {/* Latest Orders — right side (RTL), wider */}
        <OpCard variant="table" className="lg:col-span-3">
          <OpCardSection>
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">آخر الطلبات</h2>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">أحدث 5 طلبات مسجّلة</p>
            </div>
          </OpCardSection>
          <LatestOrders orders={orders} />
        </OpCard>

        {/* Sales Chart — left side (RTL), narrower */}
        <div className="lg:col-span-2">
          <DashboardSalesChart data={stats ?? null} />
        </div>
      </section>

      {/* ── Featured Products Row (Full Width) ─────────── */}
      <section aria-label="المنتجات المميزة">
        <FeaturedProductsCarousel products={products} />
      </section>
    </div>
  )
}