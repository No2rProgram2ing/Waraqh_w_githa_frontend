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

export function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={
              <Navigate
                to="/admin/products"
                replace
              />
            }
          />

          <Route
            path="/admin/products"
            element={<ProductsPage />}
          />
          <Route
            path="/admin/products/:productId"
            element={<ProductDetailsPage />}
          />
          <Route
            path="/admin/products/:productId/edit"
            element={<ProductEditPage />}
          />
          <Route
            path="/admin/categories"
            element={<CategoriesPage />}
          />
          <Route
            path="/admin/roles"
            element={<RolesPage />}
          />
          <Route
            path="/admin/activity-logs"
            element={<ActivityLogsPage />}
          />
          <Route
            path="/admin/design"
            element={<DesignPage />}
          />
          <Route
            path="/admin/product-attributes"
            element={<AttributesPage />}
          />
          <Route
            path="/admin/customers"
            element={<CustomersPage />}
          />
          <Route
            path="/admin/customers/:id"
            element={<CustomerDetailsPage />}
          />
          <Route
            path="/admin/reviews"
            element={<ReviewsPage />}
          />
          <Route
            path="/admin/admin-users"
            element={<AdminUsersPage />}
          />
          <Route
            path="/admin/profile"
            element={<ProfilePage />}
          />
          <Route
            path="/admin/settings"
            element={<SettingsPage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/admin/login"
            replace
          />
        }
      />
    </Routes>
  )
}