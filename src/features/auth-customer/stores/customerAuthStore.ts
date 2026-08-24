import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/auth';
import { customerAuthStorage } from '@/features/auth-customer/services/customerAuthStorage';
import type { LoginResponse } from '@/api/auth';

type CustomerUser = LoginResponse['user'];

interface CustomerAuthState {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;

  /** Called immediately after a successful login to hydrate the store. */
  setUser: (user: CustomerUser) => void;
  setToken: (token: string | null) => void;
  setAuth: (payload: { user: CustomerUser; token: string }) => void;
  hydrateFromStorage: () => void;

  /** Logs the customer out: calls the API (best-effort), clears storage & resets state. */
  logout: () => Promise<void>;

  /** Resets the store (e.g. on token expiry / 401). */
  clearAuth: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: customerAuthStorage.getToken(),
      isAuthenticated: Boolean(customerAuthStorage.getToken()),
      isHydrated: false,
      isLoading: false,

      setUser: (user: CustomerUser): void => {
        customerAuthStorage.setUser(user);
        set({ user, isAuthenticated: true, token: get().token ?? customerAuthStorage.getToken() });
      },

      setToken: (token: string | null): void => {
        if (token) {
          customerAuthStorage.setToken(token);
        } else {
          customerAuthStorage.clearToken();
        }

        set({ token, isAuthenticated: Boolean(token && get().user) });
      },

      setAuth: ({ user, token }: { user: CustomerUser; token: string }): void => {
        customerAuthStorage.setToken(token);
        customerAuthStorage.setUser(user);
        set({ user, token, isAuthenticated: true, isHydrated: true });
      },

      hydrateFromStorage: (): void => {
        const token = customerAuthStorage.getToken();
        const user = customerAuthStorage.getUser<CustomerUser>();
        set({
          token,
          user,
          isAuthenticated: Boolean(token && user),
          isHydrated: true,
        });
      },

      logout: async (): Promise<void> => {
        set({ isLoading: true });

        try {
          await authApi.logout();
        } catch {
          // Ignore backend logout failures so the client-side session is always cleared.
        } finally {
          customerAuthStorage.clearAll();
          set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });
        }
      },

      clearAuth: (): void => {
        customerAuthStorage.clearAll();
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });
      },
    }),
    {
      name: 'customer-auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          state.isAuthenticated = Boolean(state.token && state.user);
        }
      },
    },
  ),
);

if (typeof window !== 'undefined') {
  useCustomerAuthStore.getState().hydrateFromStorage();
}
