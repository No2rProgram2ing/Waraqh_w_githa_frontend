import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCustomerAuthStore } from '@/features/auth-customer/stores/customerAuthStore';
import { ROUTES } from '@/routes/paths';

/**
 * Wraps any route that requires the customer to be logged in.
 * Unauthenticated visitors are redirected to /login with the
 * originating location stored in `state.from` so the login page
 * can redirect them back after a successful login.
 */
function CustomerProtectedRoute() {
  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default CustomerProtectedRoute;
