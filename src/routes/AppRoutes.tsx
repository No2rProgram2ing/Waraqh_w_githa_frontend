import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { SignupPage } from "@/features/auth-customer/pages/SignupPage";
import { LoginPage } from "@/features/auth-customer/pages/LoginPage";
import { ForgotPasswordPage } from "@/features/auth-customer/pages/ForgotPasswordPage";
import { CheckEmailPage } from "@/features/auth-customer/pages/CheckEmailPage";
import { ResetPasswordPage } from "@/features/auth-customer/pages/ResetPasswordPage";
import { OtpVerificationPage } from "@/features/auth-customer/pages/OtpVerificationPage";

import { LandingPage } from "@/features/landing/pages/LandingPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { AboutPage } from "@/features/about/pages/AboutPage";

import { ProductDetailsPage } from "@/features/products/pages/ProductDetailsPage";

import { CartPage } from "@/features/cart/pages/CartPage";
import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { CheckoutSuccessPage } from "@/features/checkout/pages/CheckoutSuccessPage";

import { OrdersPage } from "@/features/orders/pages/OrdersPage";

import { CustomRequestsPage } from "@/features/custom-requests/pages/CustomRequestsPage";
import { RequestSubmittedPage } from "@/features/custom-requests/pages/RequestSubmittedPage";
import { CustomRequestDetailsPage } from "@/features/custom-requests/pages/CustomRequestDetailsPage";

import { ROUTES } from "@/routes/paths";

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path={ROUTES.welcome} element={<LandingPage />} />

        <Route path={ROUTES.home} element={<HomePage />} />

        <Route path={ROUTES.aboutUs} element={<AboutPage />} />

        <Route
          path="/products/:productId"
          element={<ProductDetailsPage />}
        />

        <Route path={ROUTES.cart} element={<CartPage />} />

        <Route path={ROUTES.checkout} element={<CheckoutPage />} />

        <Route
          path={ROUTES.checkoutSuccess}
          element={<CheckoutSuccessPage />}
        />

        <Route path={ROUTES.orders} element={<OrdersPage />} />

        <Route
          path={ROUTES.customRequests}
          element={<CustomRequestsPage />}
        />

        <Route
          path={ROUTES.customRequestSubmitted}
          element={<RequestSubmittedPage />}
        />

        <Route
          path="/custom-requests/:requestId"
          element={<CustomRequestDetailsPage />}
        />

        <Route path={ROUTES.signup} element={<SignupPage />} />

        <Route path={ROUTES.login} element={<LoginPage />} />

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
          element={<Navigate to={ROUTES.home} replace />}
        />
      </Routes>
    </AnimatePresence>
  );
}
