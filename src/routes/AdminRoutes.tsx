import { Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from '@/components/shared/AdminLayout'
import AdminProtectedRoute from './AdminProtectedRoute'

import AdminLoginPage from '@/features/auth/pages/AdminLoginPage'
import ProductsPage from '@/features/catalog/pages/ProductsPage'
import ProductDetailsPage from '@/features/catalog/pages/ProductDetailsPage'
import ProductEditPage from '@/features/catalog/pages/ProductEditPage'
import CategoriesPage from '@/features/catalog/pages/CategoriesPage'
import RolesPage from '@/features/roles/pages/RolesPage'
import ActivityLogsPage from '@/features/activity-log/pages/ActivityLogsPage'
import DesignPage from '@/features/design/pages/DesignPage'
import AttributesPage from '@/features/catalog/pages/AttributesPage'
import CustomersPage from '@/features/customers/pages/CustomersPage'
import CustomerDetailsPage from '@/features/customers/pages/CustomerDetailsPage'
import ReviewsPage from '@/features/reviews/pages/ReviewsPage'
import AdminUsersPage from '@/features/admin-users/pages/AdminUsersPage'
import ProfilePage from '@/features/settings/pages/ProfilePage'
import SettingsPage from '@/features/settings/pages/SettingsPage'

// Operations pages
import DashboardPage from '@/features/operations/pages/DashboardPage'
import OrdersPage from '@/features/operations/pages/OrdersPage'
import CreateOrderPage from '@/features/operations/pages/CreateOrderPage'
import OrderDetailsPage from '@/features/operations/pages/OrderDetailsPage'
import CustomOrdersPage from '@/features/operations/pages/CustomOrdersPage'
import CustomizationsPage from '@/features/operations/pages/CustomizationsPage'
import FreeDesignRequestsPage from '@/features/operations/pages/FreeDesignRequestsPage'
import ProductionPage from '@/features/operations/pages/ProductionPage'
import PaymentsPage from '@/features/operations/pages/PaymentsPage'
import NotificationsPage from '@/features/operations/pages/NotificationsPage'
import InventoryPage from '@/features/operations/pages/InventoryPage'
import ReportsPage from '@/features/operations/pages/ReportsPage'

export function AdminRoutes() {
  return (
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
          <Route path="free-design-requests" element={<FreeDesignRequestsPage />} />
          <Route path="production-stages" element={<ProductionPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="raw-materials" element={<InventoryPage />} />
          <Route path="reports" element={<ReportsPage />} />

          {/* Existing routes */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:productId" element={<ProductDetailsPage />} />
          <Route path="products/:productId/edit" element={<ProductEditPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
          <Route path="design" element={<DesignPage />} />
          <Route path="product-attributes" element={<AttributesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="admin-users" element={<AdminUsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  )
}
