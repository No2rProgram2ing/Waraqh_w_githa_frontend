import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'

function AdminProtectedRoute() {
  const admin = useAdminAuthStore((state) => state.admin)
  const isAuthenticated = useAdminAuthStore(
    (state) => state.isAuthenticated,
  )
  const isInitialized = useAdminAuthStore(
    (state) => state.isInitialized,
  )
  const initialize = useAdminAuthStore(
    (state) => state.initialize,
  )

  const location = useLocation()

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        جاري التحقق من جلسة المدير...
      </div>
    )
  }

  if (!isAuthenticated || !admin) {
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