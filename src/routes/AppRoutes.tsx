import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SignupPage } from "@/features/auth-customer/pages/SignupPage";
import { LoginPage } from "@/features/auth-customer/pages/LoginPage";
import { ForgotPasswordPage } from "@/features/auth-customer/pages/ForgotPasswordPage";
import { CheckEmailPage } from "@/features/auth-customer/pages/CheckEmailPage";
import { ResetPasswordPage } from "@/features/auth-customer/pages/ResetPasswordPage"
import { OtpVerificationPage } from "@/features/auth-customer/pages/OtpVerificationPage"; // استيراد الصفحة الجديدة
import { ROUTES } from "@/routes/paths";


/**
 * Route table for the app. Wrapped in AnimatePresence so each page's
 * own enter/exit motion (defined in the page component) plays on
 * navigation instead of an abrupt swap.
 */
export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to={ROUTES.signup} replace />} />
        <Route path={ROUTES.signup} element={<SignupPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.checkEmail} element={<CheckEmailPage />} />
        <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />        
        <Route path={ROUTES.otpVerification} element={<OtpVerificationPage />} />        
        <Route path="*" element={<Navigate to={ROUTES.signup} replace />} />
      </Routes>
    </AnimatePresence>
  );
}
