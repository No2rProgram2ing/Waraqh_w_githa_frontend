import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { adminAuthApi } from '../api/adminAuthApi'
import { adminAuthStorage } from '../services/adminAuthStorage'
import type { AdminUser } from '../types/admin'

interface AdminAuthContextValue {
  admin: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AdminAuthContext =
  createContext<AdminAuthContextValue | undefined>(undefined)

interface AdminAuthProviderProps {
  children: ReactNode
}

export function AdminAuthProvider({
  children,
}: AdminAuthProviderProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setIsLoading(true)

      try {
        const response = await adminAuthApi.login({
          email,
          password,
        })

        adminAuthStorage.setToken(response.data.token)
        setAdmin(response.data.admin)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true)

    try {
      await adminAuthApi.logout()
    } finally {
      adminAuthStorage.clearToken()
      setAdmin(null)
      setIsLoading(false)
    }
  }, [])

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      admin,
      isAuthenticated: admin !== null,
      isLoading,
      login,
      logout,
    }),
    [admin, isLoading, login, logout],
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error(
      'useAdminAuth must be used within AdminAuthProvider',
    )
  }

  return context
}