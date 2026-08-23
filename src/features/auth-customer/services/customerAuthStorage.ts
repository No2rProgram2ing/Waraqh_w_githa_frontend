const CUSTOMER_TOKEN_KEY = 'customer_access_token';

export const customerAuthStorage = {
  getToken(): string | null {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  },
};
