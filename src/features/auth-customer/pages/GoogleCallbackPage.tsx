import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { customerApi } from "@/api/customerApi";
import type { LoginResponse } from "@/api/auth";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { ROUTES } from "@/routes/paths";

type CustomerUser = LoginResponse["user"];

function normalizeUser(payload: Record<string, unknown>): CustomerUser {
  const avatar =
    payload.avatar_url ??
    payload.avatarUrl ??
    payload.avatar ??
    payload.image_url ??
    payload.imageUrl ??
    null;

  return {
    id: String(payload.id ?? ""),
    fullName: String(payload.full_name ?? payload.fullName ?? ""),
    email: String(payload.email ?? ""),
    phone: typeof payload.phone === "string" ? payload.phone : null,
    avatar: typeof avatar === "string" ? avatar : null,
    avatarUrl: typeof avatar === "string" ? avatar : null,
  };
}

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useCustomerAuthStore((state) => state.setAuth);
  const clearAuth = useCustomerAuthStore((state) => state.clearAuth);

  useEffect(() => {
    let cancelled = false;

    const completeLogin = async () => {
      const code = searchParams.get("code");

      if (!code) {
        clearAuth();
        navigate(ROUTES.login, { replace: true });
        return;
      }

      try {
        const { data } = await customerApi.post("/auth/google/exchange", { code });
        const token = String(data?.token ?? "");
        const payload = (data?.user ?? data?.data ?? data?.profile ?? data) as Record<string, unknown>;
        const user = normalizeUser(payload);

        if (!token || !user.id) {
          throw new Error("Google exchange response did not include valid authentication data.");
        }

        if (!cancelled) {
          setAuth({ token, user });
          navigate(ROUTES.home, { replace: true });
        }
      } catch (error) {
        console.error("Failed to complete Google login", error);
        if (!cancelled) {
          clearAuth();
          navigate(ROUTES.login, { replace: true });
        }
      }
    };

    void completeLogin();
    return () => {
      cancelled = true;
    };
  }, [clearAuth, navigate, searchParams, setAuth]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f5] text-[#52663c]">
      جارٍ إكمال تسجيل الدخول...
    </main>
  );
}
