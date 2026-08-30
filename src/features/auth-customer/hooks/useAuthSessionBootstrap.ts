import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "@/api/customerApi";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import type { LoginResponse } from "@/api/auth";

type CustomerUser = LoginResponse["user"];

const normalizeUser = (payload: any): CustomerUser => ({
  id: String(payload?.id ?? ""),
  fullName: payload?.full_name ?? payload?.fullName ?? "",
  email: payload?.email ?? "",
  phone: payload?.phone ?? null,
  avatarUrl:
    payload?.avatar_url ??
    payload?.avatarUrl ??
    payload?.avatar ??
    payload?.image_url ??
    payload?.imageUrl ??
    payload?.avatar_data_url ??
    payload?.avatarDataUrl ??
    null,
});

export function useAuthSessionBootstrap() {
  const token = useCustomerAuthStore((state) => state.token);
  const isHydrated = useCustomerAuthStore((state) => state.isHydrated);
  const setUser = useCustomerAuthStore((state) => state.setUser);
  const clearAuth = useCustomerAuthStore((state) => state.clearAuth);

  const sessionQuery = useQuery({
    queryKey: ["customer-me"],
    enabled: Boolean(token) && isHydrated,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;
      return status !== 401 && failureCount < 1;
    },
    queryFn: async () => {
      const { data } = await customerApi.get("/customer/profile");
      const payload = data?.user ?? data?.data ?? data?.profile ?? data;
      const apiUser = normalizeUser(payload);
      const storedUser = useCustomerAuthStore.getState().user;
      const fallbackAvatar =
        storedUser?.avatarUrl && storedUser.avatarUrl.startsWith("data:image/")
          ? storedUser.avatarUrl
          : apiUser.avatarUrl;

      const mergedUser = {
        ...apiUser,
        avatarUrl: fallbackAvatar ?? apiUser.avatarUrl ?? null,
      };

      setUser(mergedUser);
      return mergedUser;
    },
    throwOnError: false,
  });

  useEffect(() => {
    if (sessionQuery.isError && token) {
      clearAuth();
    }
  }, [sessionQuery.isError, token, clearAuth]);

  return {
    isCheckingAuth: !isHydrated || sessionQuery.isPending,
    isAuthenticated: Boolean(token),
    user: sessionQuery.data ?? useCustomerAuthStore.getState().user,
  };
}
