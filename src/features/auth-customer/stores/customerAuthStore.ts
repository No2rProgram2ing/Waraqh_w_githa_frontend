import { create } from 'zustand';
import { authApi } from '@/api/auth';
import { customerAuthStorage } from '@/features/auth-customer/services/customerAuthStorage';
import type { LoginResponse } from '@/api/auth';

type CustomerUser = LoginResponse['user'];

interface CustomerAuthState {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /** Called immediately after a successful login to hydrate the store. */
  setUser: (user: CustomerUser) => void;

  /** Logs the customer out: calls the API (best-effort), clears storage & resets state. */
  logout: () => Promise<void>;

  /** Resets the store (e.g. on token expiry / 401). */
  clearAuth: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>((set) => ({
  user: null,
  // Initialise from localStorage so the guard never flickers on refresh.
  isAuthenticated: Boolean(customerAuthStorage.getToken()),
  isLoading: false,

  setUser: (user: CustomerUser): void => {
    set({ user, isAuthenticated: true });
  },

  logout: async (): Promise<void> => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } finally {
      customerAuthStorage.clearToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearAuth: (): void => {
    customerAuthStorage.clearToken();
    set({ user: null, isAuthenticated: false });
  },
}));
