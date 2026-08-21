import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from '@/components/shared/AdminLayout'
import AdminProtectedRoute from './AdminProtectedRoute'

const CustomizationForm = lazy(() =>
  import('@/features/operations/components/CustomizationForm')
)


const AdminLoginPage = lazy(() =>
  import('@/features/auth/pages/AdminLoginPage')
)

const ProductsPage = lazy(() =>
  import('@/features/catalog/pages/ProductsPage')
)

const ProductDetailsPage = lazy(() =>
  import('@/features/catalog/pages/ProductDetailsPage')
)

const ProductEditPage = lazy(() =>
  import('@/features/catalog/pages/ProductEditPage')
)

const CategoriesPage = lazy(() =>
  import('@/features/catalog/pages/CategoriesPage')
)

const RolesPage = lazy(() =>
  import('@/features/roles/pages/RolesPage')
)

const ActivityLogsPage = lazy(() =>
  import('@/features/activity-log/pages/ActivityLogsPage')
)

const DesignPage = lazy(() =>
  import('@/features/design/pages/DesignPage')
)

const AttributesPage = lazy(() =>
  import('@/features/catalog/pages/AttributesPage')
)

const CustomersPage = lazy(() =>
  import('@/features/customers/pages/CustomersPage')
)

const CustomerDetailsPage = lazy(() =>
  import('@/features/customers/pages/CustomerDetailsPage')
)

const ReviewsPage = lazy(() =>
  import('@/features/reviews/pages/ReviewsPage')
)

const AdminUsersPage = lazy(() =>
  import('@/features/admin-users/pages/AdminUsersPage')
)

const ProfilePage = lazy(() =>
  import('@/features/settings/pages/ProfilePage')
)

const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage')
)

// Operations
const DashboardPage = lazy(() =>
  import('@/features/operations/pages/DashboardPage')
)

const OrdersPage = lazy(() =>
  import('@/features/operations/pages/OrdersPage')
)

const CreateOrderPage = lazy(() =>
  import('@/features/operations/pages/CreateOrderPage')
)

const OrderDetailsPage = lazy(() =>
  import('@/features/operations/pages/OrderDetailsPage')
)

const CustomOrdersPage = lazy(() =>
  import('@/features/operations/pages/CustomOrdersPage')
)

const CustomizationsPage = lazy(() =>
  import('@/features/operations/pages/CustomizationsPage')
)

const FreeDesignRequestsPage = lazy(() =>
  import('@/features/operations/pages/FreeDesignRequestsPage')
)

const ProductionPage = lazy(() =>
  import('@/features/operations/pages/ProductionPage')
)

const PaymentsPage = lazy(() =>
  import('@/features/operations/pages/PaymentsPage')
)

const NotificationsPage = lazy(() =>
  import('@/features/operations/pages/NotificationsPage')
)

const InventoryPage = lazy(() =>
  import('@/features/operations/pages/InventoryPage')
)

const ReportsPage = lazy(() =>
  import('@/features/operations/pages/ReportsPage')
)

function PageFallback() {
  return (
    <div className="flex min-h-[300px] items-center justify-center text-sm text-[var(--color-text-muted)]">
      جاري تحميل الصفحة...
    </div>
  )
}

export function AdminRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Operations */}
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/create" element={<CreateOrderPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="custom-orders" element={<CustomOrdersPage />} />
            <Route path="customizations" element={<CustomizationsPage />} />
            <Route path="customizations/create" element={<CustomizationForm />} />

            <Route
              path="free-design-requests"
              element={<FreeDesignRequestsPage />}
            />
            <Route
              path="production-stages"
              element={<ProductionPage />}
            />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="raw-materials" element={<InventoryPage />} />
            <Route path="reports" element={<ReportsPage />} />

            {/* Existing routes */}
            <Route path="products" element={<ProductsPage />} />
            <Route
              path="products/:productId"
              element={<ProductDetailsPage />}
            />
            <Route
              path="products/:productId/edit"
              element={<ProductEditPage />}
            />
            <Route
              path="product-categories"
              element={<CategoriesPage />}
            />
            <Route path="roles" element={<RolesPage />} />
            <Route
              path="activity-logs"
              element={<ActivityLogsPage />}
            />
            <Route path="design" element={<DesignPage />} />
            <Route
              path="product-attributes"
              element={<AttributesPage />}
            />
            <Route path="customers" element={<CustomersPage />} />
            <Route
              path="customers/:id"
              element={<CustomerDetailsPage />}
            />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="admin-users" element={<AdminUsersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to="/admin/login" replace />}
        />
      </Routes>
    </Suspense>
  )
}
