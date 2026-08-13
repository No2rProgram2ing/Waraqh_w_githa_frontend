import { Bell, Menu, Search, Sun, Moon } from 'lucide-react'

import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'
import { useAdminUiStore } from '@/features/admin/stores/adminUiStore'
import { useTheme } from '@/providers/ThemeProvider'

function AdminTopbar() {
  const admin = useAdminAuthStore((state) => state.admin)

  const toggleSidebar = useAdminUiStore(
    (state) => state.toggleSidebar,
  )

  const openMobileSidebar = useAdminUiStore(
    (state) => state.openMobileSidebar,
  )

  const { theme, toggleTheme } = useTheme()

  const adminName = admin?.full_name ?? 'مدير النظام'
  const adminInitial = adminName.trim().charAt(0) || 'أ'

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border)] px-4 backdrop-blur sm:px-6"
      style={{
        // color-mix() cannot be expressed as a Tailwind arbitrary value
        backgroundColor: 'color-mix(in srgb, var(--color-surface-card) 95%, transparent)',
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={openMobileSidebar}
          className="rounded-xl p-2 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[#45592D]/10 hover:text-[#45592D] lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden rounded-xl p-2 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[#45592D]/10 hover:text-[#45592D] lg:block"
          aria-label="طي القائمة الجانبية"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="hidden w-64 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 sm:flex">
          <Search className="h-4 w-4 shrink-0 text-[var(--color-text-faint)]" />
          <input
            type="search"
            placeholder="بحث..."
            className="w-full bg-transparent px-2 py-2 text-sm text-[var(--color-text-secondary)] outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[#45592D]/10 hover:text-[#45592D]"
          aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
          title={theme === 'dark' ? 'وضع فاتح' : 'وضع داكن'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[#45592D]/10 hover:text-[#45592D]"
          aria-label="الإشعارات"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-red-500" />
        </button>

        {/* Admin info */}
        <div className="flex items-center gap-3 border-r border-[var(--color-border)] pr-3 sm:pr-4">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#45592D] text-sm font-bold text-white sm:h-10 sm:w-10">
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

          <div className="hidden min-w-0 md:block">
            <p className="max-w-40 truncate text-sm font-semibold text-[var(--color-text-primary)]">
              {adminName}
            </p>
            <p className="text-xs text-[var(--color-text-faint)]">
              مدير النظام
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar