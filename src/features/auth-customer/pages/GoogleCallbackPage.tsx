import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { customerApi } from "@/api/customerApi";
import type { LoginResponse } from "@/api/auth";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { ROUTES } from "@/routes/paths";

type CustomerUser = LoginResponse["user"];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeUser(payload: unknown): CustomerUser {
  const data = asRecord(payload);
  const avatar =
    data.avatar_url ??
    data.avatarUrl ??
    data.avatar ??
    data.image_url ??
    data.imageUrl ??
    null;

  return {
    id: String(data.id ?? ""),
    fullName: String(data.full_name ?? data.fullName ?? ""),
    email: String(data.email ?? ""),
    phone: typeof data.phone === "string" ? data.phone : null,
    avatar: typeof avatar === "string" ? avatar : null,
    avatarUrl: typeof avatar === "string" ? avatar : null,
  };
}

function getGoogleToken(payload: unknown): string {
  const data = asRecord(payload);
  return String(data.token ?? data.access_token ?? data.accessToken ?? "");
}

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useCustomerAuthStore((state) => state.setAuth);
  const clearAuth = useCustomerAuthStore((state) => state.clearAuth);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const completeLogin = async () => {
      const code = searchParams.get("code");
      const callbackError = searchParams.get("error");
      const callbackToken =
        searchParams.get("token") ??
        searchParams.get("access_token") ??
        searchParams.get("accessToken");

      if (callbackError || (!code && !callbackToken)) {
        clearAuth();
        navigate(ROUTES.login, { replace: true });
        return;
      }

      try {
        let responseData: unknown = callbackToken ? { token: callbackToken } : {};

        if (code) {
          const { data } = await customerApi.post("/auth/google/exchange", { code });
          responseData = data;
        }

        const response = asRecord(responseData);
        const token = getGoogleToken(response) || getGoogleToken(response.data) || callbackToken || "";
        const userPayload =
          response.user ??
          response.customer ??
          asRecord(response.data).user ??
          response.data ??
          response.profile;
        let user = normalizeUser(userPayload);

        // Some API versions return the token first and expose the user through /customer/profile.
        if (token && !user.id) {
          const { data } = await customerApi.get("/customer/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profileResponse = asRecord(data);
          user = normalizeUser(
            profileResponse.user ??
              profileResponse.data ??
              profileResponse.profile ??
              profileResponse,
          );
        }

        if (!token || !user.id) {
          throw new Error("Google exchange response did not include valid authentication data.");
        }

        setAuth({ token, user });
        navigate(ROUTES.home, { replace: true });
      } catch (error) {
        console.error("Failed to complete Google login", error);
        clearAuth();
        navigate(ROUTES.login, { replace: true });
      }
    };

    void completeLogin();
  }, [clearAuth, navigate, searchParams, setAuth]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f5] text-[#52663c]">
      جارٍ إكمال تسجيل الدخول...
    </main>
  );
}
