import { Helmet } from 'react-helmet-async'
import { useDashboardStats, useLatestOrders, useFeaturedProducts } from '../hooks/useDashboard'
import { DashboardKpiCard } from '../components/DashboardKpiCard'
import { DashboardSalesChart } from '../components/DashboardSalesChart'
import { LatestOrders } from '../components/LatestOrders'
import { FeaturedProductsCarousel } from '../components/FeaturedProductsCarousel'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, } = useDashboardStats()
  const { data: orders, isLoading: ordersLoading } = useLatestOrders(5)
  const { data: products, isLoading: productsLoading } = useFeaturedProducts(6)

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>نظرة عامة — لوحة الإدارة</title>
      </Helmet>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardKpiCard title="إجمالي المبيعات" value={statsLoading ? '...' : stats?.total_revenue ? `${Number(stats.total_revenue).toLocaleString('ar-SA')} ر.س` : '---'} subtitle={stats ? undefined : 'يتطلب endpoint من الباك لإجمالي الإيرادات'} percent={stats ? undefined as any : null} />
          <DashboardKpiCard title="الطلبات الجديدة" value={statsLoading ? '...' : stats?.pending ?? '---'} />
          <DashboardKpiCard title="طلبات قيد التصنيع" value={statsLoading ? '...' : stats?.production ?? '---'} />
          <DashboardKpiCard title="بانتظار موافقة الجودة" value={0} subtitle={"معلومة غير متوفرة حالياً"} />
        </div>

        <div>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-right">آخر الطلبات</h2>
              <div className="mt-3">
                <LatestOrders orders={orders} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-right">المنتجات المميزة</h2>
              <div className="mt-3">
                <FeaturedProductsCarousel products={products} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <DashboardSalesChart data={stats ?? null} />
      </div>
    </div>
  )
}
