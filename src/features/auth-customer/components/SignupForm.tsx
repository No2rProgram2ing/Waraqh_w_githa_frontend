import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { PasswordStrengthMeter } from "@/features/auth-customer/components/PasswordStrengthMeter";
import { useSignup } from "@/features/auth-customer/hooks/useSignup";
import { signupSchema, type SignupSchema } from "@/features/auth-customer/schema";

const fieldStagger = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.45, ease: "easeOut" as const },
  }),
};

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = handleSubmit(async (values) => {
    await signup.mutateAsync({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
  });

  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fieldStagger}
      >
        <h1 className="text-2xl font-bold text-brand-ink text-center">إنشاء حساب</h1>
        <p className="mt-2 text-[15px] text-brand-muted text-center">ابدأ تجربتك في عالم المنتجات اليدوية الفاخرة.</p>
      </motion.div>

      <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <motion.div custom={1} initial="hidden" animate="visible" variants={fieldStagger}>
          <Input
            label="الاسم الكامل"
            placeholder="أحمد محمد"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fieldStagger}>
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </motion.div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={fieldStagger}>
          <Input
            label="رقم الهاتف"
            type="tel"
            placeholder="+967 7xx xxx xxx"
            dir="ltr"
            autoComplete="tel"
            icon={<PhoneIcon />}
            iconPosition="left"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </motion.div>

        <motion.div custom={4} initial="hidden" animate="visible" variants={fieldStagger} className="flex flex-col gap-2">
          <Input
            label="كلمة المرور"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            iconPosition="left"
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
          <PasswordStrengthMeter password={password ?? ""} />
          {!errors.password && <p className="text-sm text-brand-muted">أدخل 8 أحرف على الأقل</p>}
        </motion.div>

        <motion.div custom={5} initial="hidden" animate="visible" variants={fieldStagger}>
          <Input
            label="تأكيد كلمة المرور"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            iconPosition="left"
            icon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="pointer-events-auto text-brand-muted hover:text-brand-ink transition-colors"
                aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
            {...register("confirmPassword")}
          />
        </motion.div>

        <motion.div custom={6} initial="hidden" animate="visible" variants={fieldStagger}>
          <Checkbox
            label={
              <>
                أوافق على{" "}
                <span className="font-medium text-brand-olive-700 underline-offset-2 hover:underline cursor-pointer">
                  الشروط والأحكام
                </span>{" "}
                و{" "}
                <span className="font-medium text-brand-olive-700 underline-offset-2 hover:underline cursor-pointer">
                  سياسة الخصوصية
                </span>
              </>
            }
            error={errors.acceptedTerms?.message}
            {...register("acceptedTerms")}
          />
        </motion.div>

        {signup.isError && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {signup.error.message || "تعذر إنشاء الحساب، حاول مرة أخرى."}
          </motion.p>
        )}

        {signup.isSuccess && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-brand-olive-700"
          >
            تم إنشاء الحساب بنجاح! جارٍ تحويلك...
          </motion.p>
        )}

        <motion.div custom={7} initial="hidden" animate="visible" variants={fieldStagger}>
          <Button type="submit" fullWidth isLoading={isSubmitting || signup.isPending}>
            إنشاء الحساب
          </Button>
        </motion.div>
      </form>

      <motion.p
        custom={8}
        initial="hidden"
        animate="visible"
        variants={fieldStagger}
        className="mt-6 text-center text-sm text-brand-muted"
      >
        لديك حساب بالفعل؟{" "}
        <Link to="/login" className="font-semibold text-brand-olive-700 hover:underline">
          تسجيل الدخول
        </Link>
      </motion.p>
    </div>
  );
}