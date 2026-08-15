import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'
import logo from '@/assets/images/logo.png'

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = useAdminAuthStore(
    (state) => state.isAuthenticated,
  )

  const isLoading = useAdminAuthStore(
    (state) => state.isLoading,
  )

  const error = useAdminAuthStore(
    (state) => state.error,
  )

  const login = useAdminAuthStore(
    (state) => state.login,
  )

  const clearError = useAdminAuthStore(
    (state) => state.clearError,
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) {
    const from =
      (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname ?? '/admin'

    return (
      <Navigate
        to={from}
        replace
      />
    )
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    clearError()

    try {
      await login(email.trim(), password)

      const from =
        (location.state as { from?: { pathname?: string } } | null)
          ?.from?.pathname ?? '/admin'

      navigate(from, {
        replace: true,
      })
    } catch {
      // Authentication errors are handled by the store.
    }
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4 py-10"
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <img
            src={logo}
            alt="ورقة وجذع"
            className="mx-auto h-20 w-20 object-contain"
          />

          <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
            تسجيل دخول الإدارة
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            سجّل الدخول للوصول إلى لوحة الإدارة
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-[var(--color-surface-card)] p-6 shadow-sm ring-1 ring-[var(--color-border)] sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                البريد الإلكتروني
              </label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-faint)]"
                />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)

                    if (error) {
                      clearError()
                    }
                  }}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-[var(--color-border)] py-3 pl-4 pr-10 text-sm outline-none transition focus:border-[#45592D] focus:ring-2 focus:ring-[#45592D]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                كلمة المرور
              </label>

              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-faint)]"
                />

                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)

                    if (error) {
                      clearError()
                    }
                  }}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--color-border)] py-3 pl-11 pr-10 text-sm outline-none transition focus:border-[#45592D] focus:ring-2 focus:ring-[#45592D]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  disabled={isLoading}
                  aria-label={
                    showPassword
                      ? 'إخفاء كلمة المرور'
                      : 'إظهار كلمة المرور'
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--color-text-faint)] transition hover:text-[var(--color-text-secondary)] disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  ) : (
                    <Eye
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                isLoading ||
                !email.trim() ||
                !password
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#45592D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#374823] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin"
                  />

                  <span>
                    جارٍ تسجيل الدخول...
                  </span>
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AdminLoginPage
