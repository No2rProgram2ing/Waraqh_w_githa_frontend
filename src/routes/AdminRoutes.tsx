import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from '@/components/shared/AdminLayout'
import AdminProtectedRoute from './AdminProtectedRoute'

// ======================================================
// Authentication
// ======================================================

const AdminLoginPage = lazy(() =>
  import('@/features/auth/pages/AdminLoginPage')
)

// ======================================================
// Catalog
// ======================================================

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

const AttributesPage = lazy(() =>
  import('@/features/catalog/pages/AttributesPage')
)

// ======================================================
// Roles / Activity
// ======================================================

const RolesPage = lazy(() =>
  import('@/features/roles/pages/RolesPage')
)

const ActivityLogsPage = lazy(() =>
  import('@/features/activity-log/pages/ActivityLogsPage')
)

// ======================================================
// Design
// ======================================================

const DesignPage = lazy(() =>
  import('@/features/design/pages/DesignPage')
)

// ======================================================
// Customers
// ======================================================

const CustomersPage = lazy(() =>
  import('@/features/customers/pages/CustomersPage')
)

const CustomerDetailsPage = lazy(() =>
  import('@/features/customers/pages/CustomerDetailsPage')
)

// ======================================================
// Reviews / Users / Settings
// ======================================================

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

// ======================================================
// Operations
// ======================================================

const DashboardPage = lazy(() =>
  import('@/features/operations/pages/DashboardPage')
)

const OrdersPage = lazy(() =>
  import('@/features/operations/pages/OrdersPage')
)

const OrderCreatePage = lazy(() =>
  import('@/features/operations/pages/OrderCreatePage')
)

const OrderDetailsPage = lazy(() =>
  import('@/features/operations/pages/OrderDetailsPage')
)

// -------------------- Customizations --------------------

const CustomizationsPage = lazy(() =>
  import('@/features/operations/pages/CustomizationsPage')
)

const CustomizationCreatePage = lazy(() =>
  import('@/features/operations/pages/CustomizationCreatePage')
)

const CustomizationDetailsPage = lazy(() =>
  import('@/features/operations/pages/CustomizationDetailsPage')
)

// -------------------- Free Design --------------------

const FreeDesignRequestsPage = lazy(() =>
  import('@/features/operations/pages/FreeDesignRequestsPage')
)

const FreeDesignCreatePage = lazy(() =>
  import('@/features/operations/pages/FreeDesignCreatePage')
)

const FreeDesignDetailsPage = lazy(() =>
  import('@/features/operations/pages/FreeDesignDetailsPage')
)

// -------------------- Other Operations --------------------

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
    <div
      dir="rtl"
      className="flex min-h-[300px] items-center justify-center text-sm text-[var(--color-text-muted)]"
    >
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
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />

            {/* Operations */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />

            {/* IMPORTANT: create must be a real route. */}
            <Route path="orders/create" element={<OrderCreatePage />} />

            <Route path="orders/:orderId" element={<OrderDetailsPage />} />

            {/* Customizations */}
            <Route path="customizations" element={<CustomizationsPage />} />
            <Route path="customizations/new" element={<CustomizationCreatePage />} />
            <Route path="customizations/:id" element={<CustomizationDetailsPage />} />

            {/* Free Design Requests */}
            <Route path="free-design-requests" element={<FreeDesignRequestsPage />} />
            <Route path="free-design-requests/new" element={<FreeDesignCreatePage />} />
            <Route path="free-design-requests/:id" element={<FreeDesignDetailsPage />} />

            {/* Production */}
            <Route path="production-stages" element={<ProductionPage />} />

            {/* Payments */}
            <Route path="payments" element={<PaymentsPage />} />

            {/* Notifications */}
            <Route path="notifications" element={<NotificationsPage />} />

            {/* Inventory */}
            <Route path="raw-materials" element={<InventoryPage />} />

            {/* Reports */}
            <Route path="reports" element={<ReportsPage />} />

            {/* Catalog */}
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:productId" element={<ProductDetailsPage />} />
            <Route path="products/:productId/edit" element={<ProductEditPage />} />
            <Route path="product-categories" element={<CategoriesPage />} />
            <Route path="product-attributes" element={<AttributesPage />} />

            {/* System */}
            <Route path="roles" element={<RolesPage />} />
            <Route path="activity-logs" element={<ActivityLogsPage />} />
            <Route path="design" element={<DesignPage />} />

            {/* Customers */}
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailsPage />} />

            {/* Reviews / Users / Settings */}
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
