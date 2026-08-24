import axios from "axios";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";

export const customerApiBase = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");

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
    const hasStoredToken = Boolean(customerAuthStorage.getToken());

    if (error?.response?.status === 401 && hasStoredToken) {
      // Clear local auth state without calling the API (token is already invalid)
      useCustomerAuthStore.getState().clearAuth();
      // Hard redirect flushes React Query cache and any in-memory auth state
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);
