import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { PasswordStrengthMeter } from "@/features/auth-customer/components/PasswordStrengthMeter";

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // بعد نجاح حفظ كلمة المرور يتم التوجيه لصفحة الدخول
    navigate("/login");
  };

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

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Input
                label="كلمة المرور الجديدة"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                iconPosition="left"
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="pointer-events-auto text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
                required
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <Input
              label="تأكيد كلمة المرور"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              iconPosition="left"
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="pointer-events-auto text-brand-muted hover:text-brand-ink transition-colors"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
              required
            />

            <Button type="submit" fullWidth className="mt-2 gap-2">
              <span>حفظ كلمة المرور الجديدة</span>
              <span className="text-sm">✓</span>
            </Button>
          </form>

          <Link
            to="/login"
            className="mt-6 text-center text-xs font-medium text-brand-olive-700 hover:underline"
          >
            ➔ العودة لتسجيل الدخول
          </Link>
        </div>
      </AuthLayout>
    </motion.div>
  );
}