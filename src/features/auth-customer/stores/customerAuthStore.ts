import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/auth';
import { migrateGuestWishlist } from '@/api/favoritesApi';
import { customerAuthStorage } from '@/features/auth-customer/services/customerAuthStorage';
import type { LoginResponse } from '@/api/auth';

type CustomerUser = LoginResponse['user'];

const normalizeStoredUser = (user: CustomerUser | null | undefined): CustomerUser | null => {
  if (!user) return null;

  const avatar = user.avatar ?? user.avatarUrl ?? null;
  return {
    ...user,
    avatar,
    avatarUrl: user.avatarUrl ?? avatar,
  };
};

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
        const normalizedUser = normalizeStoredUser(user);
        if (!normalizedUser) return;

        customerAuthStorage.setUser(normalizedUser);
        customerAuthStorage.setAvatar(normalizedUser.id, normalizedUser.avatarUrl ?? normalizedUser.avatar);
        set({ user: normalizedUser, isAuthenticated: true, token: get().token ?? customerAuthStorage.getToken() });
        void migrateGuestWishlist().catch((error) => {
          console.error("Failed to migrate guest wishlist", error);
        });
        void import("@/features/cart/stores/cartStore").then(({ useCartStore }) => {
          void useCartStore.getState().syncGuestCart();
        });
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
        const normalizedUser = normalizeStoredUser(user);
        const cachedAvatar = normalizedUser ? customerAuthStorage.getAvatar(normalizedUser.id) : null;
        const existing = normalizeStoredUser(customerAuthStorage.getUser<CustomerUser>());
        const mergedUser = normalizedUser
          ? {
              ...normalizedUser,
              avatar: normalizedUser.avatar ?? cachedAvatar ?? existing?.avatar ?? null,
              avatarUrl: normalizedUser.avatarUrl ?? cachedAvatar ?? existing?.avatarUrl ?? existing?.avatar ?? null,
            }
          : existing ?? null;

        customerAuthStorage.setToken(token);
        if (mergedUser) {
          customerAuthStorage.setUser(mergedUser);
          customerAuthStorage.setAvatar(mergedUser.id, mergedUser.avatarUrl ?? mergedUser.avatar);
        }
        set({ user: mergedUser, token, isAuthenticated: Boolean(token && mergedUser), isHydrated: true });
        void migrateGuestWishlist().catch((error) => {
          console.error("Failed to migrate guest wishlist", error);
        });
        void import("@/features/cart/stores/cartStore").then(({ useCartStore }) => {
          void useCartStore.getState().syncGuestCart();
        });
      },

      hydrateFromStorage: (): void => {
        const token = customerAuthStorage.getToken();
        const user = normalizeStoredUser(customerAuthStorage.getUser<CustomerUser>());
        set({
          token,
          user,
          isAuthenticated: Boolean(token && user),
          isHydrated: true,
        });
        if (token && user) {
          void migrateGuestWishlist().catch((error) => {
            console.error("Failed to migrate guest wishlist", error);
          });
          void import("@/features/cart/stores/cartStore").then(({ useCartStore }) => {
            void useCartStore.getState().syncGuestCart();
          });
        }
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
