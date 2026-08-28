import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "@/features/home/pages/HomePage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { ProductDetailsPage } from "@/features/products/pages/ProductDetailsPage";
import { AboutPage } from "@/features/about/pages/AboutPage";
import { ShowCustomRequestsPage } from "@/features/custom-requests/pages/ShowCustomeRequestsPage";
import { CustomRequestsPage } from "@/features/custom-requests/pages/CustomRequestsPage";
import { CustomRequestDetailsPage } from "@/features/custom-requests/pages/CustomRequestDetailsPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { CheckoutSuccessPage } from "@/features/checkout/pages/CheckoutSuccessPage";
import { LoginPage } from "@/features/auth-customer/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { PersonalInfoPage } from "@/features/profile/pages/PersonalInfoPage";
import { AddressesPage } from "@/features/addresses/pages/AddressesPage";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { OrderDetailsPage } from "@/features/orders/pages/OrderDetailsPage";
import { SearchPage } from "@/features/search/pages/SearchPage";
import { NotificationsPage } from "@/features/notification/pages/NotificationsPage";
import { WishlistsPage } from "@/features/wishlists/pages/WishlistsPageFixed";
import { ROUTES } from "@/routes/paths";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.home} replace />} />
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.products} element={<ProductsPage />} />
      <Route path={ROUTES.productDetail} element={<ProductDetailsPage />} />
      <Route path={ROUTES.aboutUs} element={<AboutPage />} />

      <Route path={ROUTES.customRequests} element={<ShowCustomRequestsPage />} />
      <Route path={ROUTES.customRequestsNew} element={<CustomRequestsPage />} />
      <Route path={ROUTES.customRequestDetail} element={<CustomRequestDetailsPage />} />

      <Route path={ROUTES.cart} element={<CartPage />} />
      <Route path={ROUTES.checkout} element={<CheckoutPage />} />
      <Route path={ROUTES.checkoutSuccess} element={<CheckoutSuccessPage />} />

      <Route path={ROUTES.search} element={<SearchPage />} />
      <Route path={ROUTES.notifications} element={<NotificationsPage />} />
      <Route path={ROUTES.wishlist} element={<WishlistsPage />} />

      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.signup} element={<SignupPage />} />

      <Route path={ROUTES.profile} element={<PersonalInfoPage />} />
      <Route path={ROUTES.addresses} element={<AddressesPage />} />
      <Route path={ROUTES.orders} element={<OrdersPage />} />
      <Route path={ROUTES.orderDetail} element={<OrderDetailsPage />} />

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}

export default AppRoutes;