import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { ROUTES } from '@/routes/paths'

const SignupPage = lazy(() =>
  import('@/features/auth-customer/pages/SignupPage').then(
    ({ SignupPage }) => ({ default: SignupPage }),
  ),
)

const LoginPage = lazy(() =>
  import('@/features/auth-customer/pages/LoginPage').then(
    ({ LoginPage }) => ({ default: LoginPage }),
  ),
)

const ForgotPasswordPage = lazy(() =>
  import('@/features/auth-customer/pages/ForgotPasswordPage').then(
    ({ ForgotPasswordPage }) => ({ default: ForgotPasswordPage }),
  ),
)

const CheckEmailPage = lazy(() =>
  import('@/features/auth-customer/pages/CheckEmailPage').then(
    ({ CheckEmailPage }) => ({ default: CheckEmailPage }),
  ),
)

const ResetPasswordPage = lazy(() =>
  import('@/features/auth-customer/pages/ResetPasswordPage').then(
    ({ ResetPasswordPage }) => ({ default: ResetPasswordPage }),
  ),
)

const OtpVerificationPage = lazy(() =>
  import('@/features/auth-customer/pages/OtpVerificationPage').then(
    ({ OtpVerificationPage }) => ({ default: OtpVerificationPage }),
  ),
)

function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-text-muted)]">
          جاري تحميل الصفحة...
        </div>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<Navigate to={ROUTES.signup} replace />}
          />

          <Route
            path={ROUTES.signup}
            element={<SignupPage />}
          />

          <Route
            path={ROUTES.login}
            element={<LoginPage />}
          />

          <Route
            path={ROUTES.forgotPassword}
            element={<ForgotPasswordPage />}
          />

          <Route
            path={ROUTES.checkEmail}
            element={<CheckEmailPage />}
          />

          <Route
            path={ROUTES.resetPassword}
            element={<ResetPasswordPage />}
          />

          <Route
            path={ROUTES.otpVerification}
            element={<OtpVerificationPage />}
          />

          <Route
            path="*"
            element={<Navigate to={ROUTES.signup} replace />}
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export { AppRoutes }