import { useMutation } from '@tanstack/react-query'

import { useAdminAuthStore } from '../stores/adminAuthStore'

type AdminLoginCredentials = {
  email: string
  password: string
}

export function useAdminLogin() {
  const login = useAdminAuthStore((state) => state.login)

  return useMutation({
    mutationFn: ({ email, password }: AdminLoginCredentials) =>
      login(email, password),
  })
}