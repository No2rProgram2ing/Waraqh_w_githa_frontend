import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import logo from '@/assets/images/logo.png'
import { adminNavigation } from './adminNavigation'
import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'
import { useAdminUiStore } from '@/features/admin/stores/adminUiStore'

function AdminSidebar() {
  const navigate = useNavigate()

  const admin = useAdminAuthStore((state) => state.admin)
  const isLoading = useAdminAuthStore((state) => state.isLoading)
  const logout = useAdminAuthStore((state) => state.logout)

  const isSidebarCollapsed = useAdminUiStore(
    (state) => state.isSidebarCollapsed,
  )

  const isMobileSidebarOpen = useAdminUiStore(
    (state) => state.isMobileSidebarOpen,
  )

  const closeMobileSidebar = useAdminUiStore(
    (state) => state.closeMobileSidebar,
  )

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/admin/login', {
        replace: true,
      })
    }
  }

  const adminName = admin?.full_name ?? 'مدير النظام'
  const adminEmail = admin?.email ?? ''
  const adminInitial = adminName.trim().charAt(0) || 'أ'

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
          isMobileSidebarOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        dir="rtl"
        className={[
          'fixed inset-y-0 right-0 z-50 flex h-screen w-64 shrink-0 flex-col bg-[#2B2620] text-white shadow-xl',
          'transition-[width,transform] duration-300 ease-in-out',
          'lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0',
          isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
          isMobileSidebarOpen
            ? 'translate-x-0'
            : 'translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Header */}
        <div className="border-b border-white/10 px-4 py-5">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="ورقة وجذع"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />

            <div
              className={[
                'min-w-0 overflow-hidden transition-all duration-300',
                isSidebarCollapsed
                  ? 'lg:w-0 lg:opacity-0'
                  : 'w-auto opacity-100',
              ].join(' ')}
            >
              <h1 className="whitespace-nowrap text-lg font-bold">
                ورقة وجذع
              </h1>

              <p className="mt-1 whitespace-nowrap text-xs text-white/60">
                لوحة الإدارة
              </p>
            </div>

            {/* Mobile Close */}
            <button
              type="button"
              onClick={closeMobileSidebar}
              className="mr-auto rounded-lg p-2 text-white/60 transition hover:bg-[var(--color-surface-card)]/10 hover:text-white lg:hidden"
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-6">
            {adminNavigation.map((section, sectionIndex) => (
              <div
                key={section.label ?? `section-${sectionIndex}`}
              >
                {section.label && !isSidebarCollapsed && (
                  <h2 className="mb-2 px-3 text-xs font-semibold text-white/40">
                    {section.label}
                  </h2>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        onClick={closeMobileSidebar}
                        title={
                          isSidebarCollapsed
                            ? item.label
                            : undefined
                        }
                        className={({ isActive }) =>
                          [
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                            isActive
                              ? 'bg-[#45592D] text-white shadow-sm'
                              : 'text-white/70 hover:bg-[var(--color-surface-card)]/10 hover:text-white',
                            isSidebarCollapsed
                              ? 'lg:justify-center'
                              : '',
                          ].join(' ')
                        }
                      >
                        <Icon className="h-5 w-5 shrink-0" />

                        <span
                          className={[
                            'truncate transition-all duration-300',
                            isSidebarCollapsed
                              ? 'lg:hidden'
                              : '',
                          ].join(' ')}
                        >
                          {item.label}
                        </span>
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Admin User */}
        <div className="border-t border-white/10 p-3">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[var(--color-surface-card)]/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#45592D] font-bold">
              {admin?.avatar_url ? (
                <img
                  src={admin.avatar_url}
                  alt={adminName}
                  className="h-full w-full object-cover"
                />
              ) : (
                adminInitial
              )}
            </div>

            <div
              className={[
                'min-w-0 overflow-hidden transition-all duration-300',
                isSidebarCollapsed
                  ? 'lg:w-0 lg:opacity-0'
                  : 'w-auto opacity-100',
              ].join(' ')}
            >
              <p className="truncate text-sm font-semibold">
                {adminName}
              </p>

              <p className="truncate text-xs text-white/50">
                {adminEmail}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className={[
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70',
              'transition-all duration-200 hover:bg-[var(--color-surface-card)]/10 hover:text-white',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isSidebarCollapsed
                ? 'lg:justify-center'
                : '',
            ].join(' ')}
            title={
              isSidebarCollapsed
                ? 'تسجيل الخروج'
                : undefined
            }
          >
            <LogOut className="h-5 w-5 shrink-0" />

            <span
              className={[
                isSidebarCollapsed
                  ? 'lg:hidden'
                  : '',
              ].join(' ')}
            >
              {isLoading
                ? 'جاري تسجيل الخروج...'
                : 'تسجيل الخروج'}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar