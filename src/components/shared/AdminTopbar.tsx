import { useEffect, useRef, useState } from 'react'
import { Bell, Menu, Search, Sun, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { Product } from '@/features/catalog/types/product'
import type { Customer } from '@/features/customers/types/customer'
import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'
import { useAdminUiStore } from '@/features/admin/stores/adminUiStore'
import { useTheme } from '@/providers/ThemeProvider'
import { useGlobalSearch } from '@/features/search/hooks/useGlobalSearch'

function AdminTopbar() {
  const admin = useAdminAuthStore((state) => state.admin)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement | null>(null)

  const toggleSidebar = useAdminUiStore((state) => state.toggleSidebar)
  const openMobileSidebar = useAdminUiStore(
    (state) => state.openMobileSidebar,
  )
  const { theme, toggleTheme } = useTheme()

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const adminName = admin?.full_name ?? 'مدير النظام'
  const adminInitial = adminName.trim().charAt(0) || 'أ'

  useEffect(() => {
    const trimmedValue = searchQuery.trim()

    if (!trimmedValue) {
      setDebouncedQuery('')
      setIsDropdownOpen(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(trimmedValue)
      setIsDropdownOpen(true)
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!isDropdownOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isDropdownOpen])

  const { data: globalResults, isLoading } =
    useGlobalSearch(debouncedQuery)

  const searchGroups = [
    {
      title: 'المنتجات',
      items: globalResults?.products ?? [],
      getLabel: (product: Product) => product.name,
      getSecondary: (product: Product) => product.sku ?? '',
      path: (id: number) => `/admin/products/${id}`,
    },
    {
      title: 'العملاء',
      items: globalResults?.customers ?? [],
      getLabel: (customer: Customer) => customer.full_name,
      getSecondary: (customer: Customer) => customer.email ?? '',
      path: (id: number) => `/admin/customers/${id}`,
    },
  ]

  const hasResults = searchGroups.some(
    (group) => group.items.length > 0,
  )

  const handleSelectResult = (path: string) => {
    navigate(path)
    setSearchQuery('')
    setDebouncedQuery('')
    setIsDropdownOpen(false)
  }

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border)] px-4 backdrop-blur sm:px-6"
      style={{
        backgroundColor:
          'color-mix(in srgb, var(--color-surface-card) 95%, transparent)',
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={openMobileSidebar}
          className="rounded-xl p-2 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden rounded-xl p-2 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] lg:block"
          aria-label="طي القائمة الجانبية"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          ref={searchRef}
          className="relative hidden w-80 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 sm:flex"
        >
          <Search className="h-4 w-4 shrink-0 text-[var(--color-text-faint)]" />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) {
                setIsDropdownOpen(true)
              }
            }}
            placeholder="بحث..."
            aria-label="البحث العام"
            aria-expanded={isDropdownOpen}
            className="w-full bg-transparent px-2 py-2 text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-faint)]"
          />

          {isDropdownOpen && (
            <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-lg">
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                  جارٍ البحث...
                </div>
              ) : hasResults ? (
                <div className="max-h-80 overflow-y-auto">
                  {searchGroups.map((group) => {
                    if (group.items.length === 0) return null

                    return (
                      <div
                        key={group.title}
                        className="border-b border-[var(--color-border)] last:border-b-0"
                      >
                        <div className="px-4 py-2 text-xs font-semibold text-[var(--color-text-faint)]">
                          {group.title} ({group.items.length})
                        </div>

                        <ul>
                          {group.items.map((item) => {
                            const id = Number(item.id)
                            const label = group.getLabel(item as never)
                            const secondaryText = group.getSecondary(
                              item as never,
                            )

                            return (
                              <li key={`${group.title}-${id}`}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSelectResult(group.path(id))
                                  }
                                  className="flex w-full items-center justify-between gap-2 px-4 py-2 text-right transition-colors hover:bg-[var(--color-surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
                                >
                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                                      {label}
                                    </div>

                                    {secondaryText ? (
                                      <div className="truncate text-xs text-[var(--color-text-faint)]">
                                        {secondaryText}
                                      </div>
                                    ) : null}
                                  </div>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                  لا توجد نتائج مطابقة
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          aria-label={
            theme === 'dark'
              ? 'تفعيل الوضع الفاتح'
              : 'تفعيل الوضع الداكن'
          }
          title={theme === 'dark' ? 'وضع فاتح' : 'وضع داكن'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          className="relative rounded-xl p-2.5 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          aria-label="الإشعارات"
        >
          <Bell className="h-5 w-5" />

          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-[var(--color-danger)]"
            aria-hidden="true"
          />
        </button>

        <div className="flex items-center gap-3 border-r border-[var(--color-border)] pr-3 sm:pr-4">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent)] text-sm font-bold text-white sm:h-10 sm:w-10">
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