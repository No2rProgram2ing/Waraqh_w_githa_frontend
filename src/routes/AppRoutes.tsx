import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { SignupPage } from "@/features/auth-customer/pages/SignupPage";
import { LoginPage } from "@/features/auth-customer/pages/LoginPage";
import { ForgotPasswordPage } from "@/features/auth-customer/pages/ForgotPasswordPage";
import { CheckEmailPage } from "@/features/auth-customer/pages/CheckEmailPage";
import { ResetPasswordPage } from "@/features/auth-customer/pages/ResetPasswordPage";
import { OtpVerificationPage } from "@/features/auth-customer/pages/OtpVerificationPage";

import { LandingPage } from "@/features/landing/pages/LandingPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { AboutPage } from "@/features/about/pages/AboutPage";
import { SearchPage } from "@/features/search/pages/SearchPage";

import { ProductDetailsPage } from "@/features/products/pages/ProductDetailsPage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { CheckoutSuccessPage } from "@/features/checkout/pages/CheckoutSuccessPage";

import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { OrderDetailsPage } from "@/features/orders/pages/OrderDetailsPage";
import { OrderDesignDetailsPage } from "@/features/orders/pages/OrderDesignDetailsPage";
import { OrderTrackingPage } from "@/features/orders/pages/OrderTrackingPage";

import { CustomRequestsPage } from "@/features/custom-requests/pages/CustomRequestsPage";
import { RequestSubmittedPage } from "@/features/custom-requests/pages/RequestSubmittedPage";
import { CustomRequestDetailsPage } from "@/features/custom-requests/pages/CustomRequestDetailsPage";

import { PersonalInfoPage } from "@/features/profile/pages/PersonalInfoPage";
import { AddressesPage } from "@/features/addresses/pages/AddressesPage";
import { WishlistsPage } from "@/features/wishlists/pages/WishlistsPage";
import { NotificationsPage } from "@/features/notification/pages/NotificationsPage";

import { ROUTES } from "@/routes/paths";
import CustomerProtectedRoute from "@/routes/CustomerProtectedRoute";

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path={ROUTES.welcome} element={<LandingPage />} />
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.aboutUs} element={<AboutPage />} />
        <Route path={ROUTES.products} element={<ProductsPage />} />
        <Route path={ROUTES.productDetail} element={<ProductDetailsPage />} />
        <Route path={ROUTES.productDetails("demo")} element={<ProductDetailsPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path={ROUTES.cart} element={<CartPage />} />
        <Route path={ROUTES.checkout} element={<CheckoutPage />} />
        <Route path={ROUTES.checkoutSuccess} element={<CheckoutSuccessPage />} />
        <Route path={ROUTES.orders} element={<OrdersPage />} />
        <Route path={ROUTES.customRequests} element={<CustomRequestsPage />} />
        <Route path={ROUTES.customRequestSubmitted} element={<RequestSubmittedPage />} />
        <Route path="/custom-requests/:requestId" element={<CustomRequestDetailsPage />} />
        <Route path={ROUTES.search} element={<SearchPage />} />

        <Route path={ROUTES.signup} element={<SignupPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.checkEmail} element={<CheckEmailPage />} />
        <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
        <Route path={ROUTES.otpVerification} element={<OtpVerificationPage />} />

        <Route element={<CustomerProtectedRoute />}>
          <Route path={ROUTES.profile} element={<PersonalInfoPage />} />
          <Route path={ROUTES.personalInfo} element={<PersonalInfoPage />} />
          <Route path={ROUTES.addresses} element={<AddressesPage />} />
          <Route path={ROUTES.wishlist} element={<WishlistsPage />} />
          <Route path={ROUTES.notifications} element={<NotificationsPage />} />
          <Route path="/orders/:orderId/design" element={<OrderDesignDetailsPage />} />
          <Route path="/orders/:orderId/track" element={<OrderTrackingPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </AnimatePresence>
  );
}
