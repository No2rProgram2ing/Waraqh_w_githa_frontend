import axios from "axios";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";

function normalizeApiBaseUrl(rawBaseUrl: string): string {
  const trimmed = rawBaseUrl.trim().replace(/\/+$/, "");

  if (!trimmed) {
    return "/api";
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (/\/api(?:\/v1)?$/i.test(trimmed) || /\/v1$/i.test(trimmed)) {
    return trimmed;
  }

  return `${trimmed}/api`;
}

const isLocalFrontend = typeof window !== "undefined" && ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
const rawConfiguredApiBase = import.meta.env.VITE_API_BASE_URL;
const configuredApiBase = typeof rawConfiguredApiBase === 'string' && rawConfiguredApiBase.trim() !== '' ? rawConfiguredApiBase : undefined;

// If VITE_API_BASE_URL is explicitly provided (e.g. http://127.0.0.1:8000), prefer it.
// Otherwise keep the previous behavior: use a relative /api during local frontend runs.
export const customerApiBase = configuredApiBase ? normalizeApiBaseUrl(configuredApiBase) : (isLocalFrontend ? "/api" : "/api");

export const customerApi = axios.create({
  baseURL: customerApiBase,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach Authorization header with stored token (Bearer) when available
customerApi.interceptors.request.use((config) => {
  const token = customerAuthStorage.getToken();

  if (token) {
    // Ensure headers object exists and set Authorization as Bearer token
    config.headers = config.headers || {};
    (config.headers as any).Authorization = 'Bearer ' + token;
  }

  return config;
});

// Global 401 handler — clears session and redirects to login on token expiry
customerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const hasStoredToken = Boolean(customerAuthStorage.getToken());

      if (hasStoredToken) {
        // Clear local auth state without calling the API (token is already invalid)
        useCustomerAuthStore.getState().clearAuth();
        // Hard redirect flushes React Query cache and any in-memory auth state
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);
