const CUSTOMER_TOKEN_KEY = 'customer_access_token';
const CUSTOMER_USER_KEY = 'customer_user';
const CUSTOMER_AVATAR_KEY_PREFIX = 'customer_avatar_';

export const customerAuthStorage = {
  getToken(): string | null {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  },

  getUser<T = unknown>(): T | null {
    const raw = localStorage.getItem(CUSTOMER_USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      localStorage.removeItem(CUSTOMER_USER_KEY);
      return null;
    }
  },

  setUser<T>(user: T): void {
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
  },

  getAvatar(userId: string): string | null {
    const avatar = localStorage.getItem(`${CUSTOMER_AVATAR_KEY_PREFIX}${userId}`);
    if (avatar?.startsWith('blob:')) {
      localStorage.removeItem(`${CUSTOMER_AVATAR_KEY_PREFIX}${userId}`);
      return null;
    }

    return avatar;
  },

  setAvatar(userId: string, avatar: string | null | undefined): void {
    if (avatar && !avatar.startsWith('blob:')) {
      localStorage.setItem(`${CUSTOMER_AVATAR_KEY_PREFIX}${userId}`, avatar);
    }
  },

  clearToken(): void {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  },

  clearUser(): void {
    localStorage.removeItem(CUSTOMER_USER_KEY);
  },

  clearAll(): void {
    this.clearToken();
    this.clearUser();
  },
};
