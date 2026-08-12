const ADMIN_TOKEN_KEY = 'admin_access_token'

export const adminAuthStorage = {
  getToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
  },

  clearToken(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
  },
}