import { create } from 'zustand'
import { adminAuthApi } from '../api/adminAuthApi'
import { adminAuthStorage } from '../services/adminAuthStorage'
import type { AdminUser } from '../types/admin'

interface AdminAuthState {
  admin: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  setAdmin: (admin: AdminUser | null) => void
  updateAdmin: (admin: Partial<AdminUser>) => void
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: null,
  isAuthenticated: Boolean(adminAuthStorage.getToken()),
  isLoading: false,
  error: null,

  login: async (email: string, password: string): Promise<void> => {
    set({
      isLoading: true,
      error: null,
    })

    try {
      const response = await adminAuthApi.login({
        email,
        password,
      })

      adminAuthStorage.setToken(response.data.token)

      set({
        admin: response.data.admin,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Unable to login. Please check your credentials.'

      set({
        isLoading: false,
        error: message,
      })

      throw error
    }
  },

  logout: async (): Promise<void> => {
    set({
      isLoading: true,
      error: null,
    })

    try {
      await adminAuthApi.logout()
    } finally {
      adminAuthStorage.clearToken()

      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  },

  clearError: (): void => {
    set({
      error: null,
    })
  },

  setAdmin: (admin: AdminUser | null): void => {
    set({
      admin,
      isAuthenticated: Boolean(admin),
    })
  },

  updateAdmin: (admin: Partial<AdminUser>): void => {
    set((state) => {
      if (!state.admin) {
        return { admin: null }
      }

      return {
        admin: {
          ...state.admin,
          ...admin,
        },
      }
    })
  },
}))
