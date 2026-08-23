import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { PasswordStrengthMeter } from "@/features/auth-customer/components/PasswordStrengthMeter";
import { useCustomerResetPassword } from "@/features/auth-customer/hooks/useCustomerAuth";
import { ROUTES } from "@/routes/paths";

const resetPasswordSchema = z.object({
  email: z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
  codeOrToken: z.string().trim().min(1, "رمز التحقق مطلوب"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const resetMutation = useCustomerResetPassword();

  const defaultCode = useMemo(() => params.get("token") ?? params.get("code") ?? "", [params]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      codeOrToken: defaultCode,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await resetMutation.mutateAsync({
      email: values.email.trim(),
      code_or_token: values.codeOrToken.trim(),
      password: values.password,
      password_confirmation: values.confirmPassword,
    });

    navigate(ROUTES.login);
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <AuthLayout panel={<AuthHeroPanel />}>
        <div className="mx-auto w-full max-w-md flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-brand-ink text-center">
            تعيين كلمة مرور جديدة
          </h1>
          <p className="mt-2 text-sm text-brand-muted text-center">
            اختر كلمة مرور قوية يسهل عليك تذكرها
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit} noValidate>
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="رمز التحقق أو التوكن"
              type="text"
              placeholder="Paste token here"
              autoComplete="one-time-code"
              dir="ltr"
              error={errors.codeOrToken?.message}
              {...register("codeOrToken")}
            />

            <div className="flex flex-col gap-2">
              <Input
                label="كلمة المرور الجديدة"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                iconPosition="left"
                error={errors.password?.message}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="pointer-events-auto text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
                {...register("password")}
              />
                <PasswordStrengthMeter password={watch("password")} />
            </div>

            <Input
              label="تأكيد كلمة المرور"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              iconPosition="left"
              error={errors.confirmPassword?.message}
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="pointer-events-auto text-brand-muted hover:text-brand-ink transition-colors"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
              {...register("confirmPassword")}
            />

            {resetMutation.isError && (
              <p role="alert" className="text-sm text-red-500">
                {(resetMutation.error as { message?: string } | undefined)?.message ?? "تعذر تحديث كلمة المرور."}
              </p>
            )}

            <Button type="submit" fullWidth className="mt-2 gap-2" isLoading={isSubmitting || resetMutation.isPending}>
              <span>حفظ كلمة المرور الجديدة</span>
              <span className="text-sm">✓</span>
            </Button>
          </form>

          <Link
            to={ROUTES.login}
            className="mt-6 text-center text-xs font-medium text-brand-olive-700 hover:underline"
          >
            ➔ العودة لتسجيل الدخول
          </Link>
        </div>
      </AuthLayout>
    </motion.div>
  );
}

