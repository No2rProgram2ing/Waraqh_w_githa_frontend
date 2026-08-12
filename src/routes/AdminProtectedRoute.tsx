import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'

function AdminProtectedRoute() {
  const isAuthenticated = useAdminAuthStore(
    (state) => state.isAuthenticated,
  )

  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

export default AdminProtectedRoute