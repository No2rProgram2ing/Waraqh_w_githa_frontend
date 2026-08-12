import { Outlet } from 'react-router-dom'

import { useAdminUiStore } from '@/features/admin/stores/adminUiStore'

import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

function AdminLayout() {
  const isSidebarCollapsed = useAdminUiStore(
    (state) => state.isSidebarCollapsed,
  )

  return (
    <div
      dir="rtl"
      className="flex min-h-screen"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main application area */}
      <div
        className={[
          'flex min-w-0 flex-1 flex-col',
          'transition-all duration-300 ease-in-out',
          isSidebarCollapsed
            ? 'lg:max-w-[calc(100vw-4rem)]'
            : 'lg:max-w-[calc(100vw-16rem)]',
        ].join(' ')}
      >
        {/* Topbar */}
        <AdminTopbar />

        {/* Page content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout