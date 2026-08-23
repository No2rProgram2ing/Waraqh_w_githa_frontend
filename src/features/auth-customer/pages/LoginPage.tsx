import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { useLogin } from "@/features/auth-customer/hooks/useLogin";
import { loginSchema, type LoginSchema } from "@/features/auth-customer/schema";
import logo from "@/assets/images/Warqah & Jitha Logo.png";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useCustomerAuthStore((state) => state.setUser);
  // Where to redirect after a successful login (set by CustomerProtectedRoute)
  const from = (location.state as { from?: Location })?.from;
  const redirectTo = (from as unknown as { pathname?: string })?.pathname || "/";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
    mode: "onBlur",
  });

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = handleSubmit(async (values) => {
    console.log("🟢 [LoginPage] handleSubmit fired — validation passed", values);

    try {
      const result = await login.mutateAsync({
        phone: values.phone,
        password: values.password,
      });

      console.log("✅ [LoginPage] Login successful:", result);
      // Hydrate the auth store so the header & guards reflect the new session immediately
      setUser(result.user);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      const validationErrors = err?.fieldErrors ?? err?.response?.data?.errors;

      if (validationErrors && typeof validationErrors === "object") {
        Object.entries(validationErrors).forEach(([field, message]) => {
          const fieldName = field as keyof LoginSchema;
          setError(fieldName, {
            type: "server",
            message: Array.isArray(message) ? message[0] : String(message),
          });
        });

        console.error("🔴 [LoginPage] Backend validation errors (422):", validationErrors);
        return;
      }

      console.error(
        "🔴 [LoginPage] Login error:",
        err?.response?.data ?? err?.message ?? err,
      );
    }
  },
  // Called when react-hook-form blocks submission due to validation errors
  (formErrors) => {
    console.warn("🟡 [LoginPage] Form validation blocked submission. Errors:", formErrors);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AuthLayout panel={<AuthHeroPanel />}>
        <div className="mx-auto w-full max-w-md flex flex-col items-center">

          {/* Logo / الشعار */}
          <div className="mb-6 flex justify-center">
            <img
              src={logo}
              alt="ورقة وجذع"
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Heading / العناوين */}
          <h1 className="text-3xl font-bold text-brand-olive-700 text-center">
            أهلاً بعودتك
          </h1>
          <p className="mt-2 text-sm text-brand-muted text-center">
            سجل دخولك لتجربة استثنائية مع الحرف اليدوية
          </p>

          {/* Form / النموذج */}
          <form
            id="login-form"
            className="mt-8 w-full flex flex-col gap-5"
            onSubmit={onSubmit}
            noValidate
          >

            {/* Phone Input */}
            <Input
              label="رقم الهاتف"
              type="tel"
              placeholder="+967 7xx xxx xxx"
              autoComplete="username"
              dir="ltr"
              error={errors.phone?.message}
              {...register("phone")}
            />

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <Input
                label="كلمة المرور"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                iconPosition="left"
                error={errors.password?.message}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="pointer-events-auto text-brand-muted hover:text-brand-ink transition-colors"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
                {...register("password")}
              />

              {/* Forgot Password Link */}
              <div className="flex justify-start">
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-olive-700 underline underline-offset-2 hover:text-brand-olive-900 transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            {/* API-level error banner */}
            {login.isError && !Object.keys((login.error as { fieldErrors?: Record<string, string> } | null)?.fieldErrors ?? {}).length && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 text-center"
              >
                {login.error?.message || "تعذر تسجيل الدخول، تحقق من بياناتك وحاول مرة أخرى."}
              </motion.p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              className="mt-2"
              isLoading={isSubmitting || login.isPending}
            >
              تسجيل الدخول
            </Button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-brand-muted">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="font-semibold text-brand-ink hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </AuthLayout>
    </motion.div>
  );
}