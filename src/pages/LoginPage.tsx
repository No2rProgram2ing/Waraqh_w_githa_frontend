import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Lightweight login screen. Out of scope for the delivered design, kept
 * minimal so the "تسجيل الدخول" link from the signup page has a real
 * destination that follows the same visual language.
 */
export function LoginPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <AuthLayout panel={<AuthHeroPanel />}>
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-bold text-brand-ink">تسجيل الدخول</h1>
          <p className="mt-2 text-[15px] text-brand-muted">مرحباً بعودتك إلى ورقة وجينة.</p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <Input label="البريد الإلكتروني" type="email" placeholder="name@example.com" dir="ltr" className="text-end" />
            <Input label="كلمة المرور" type="password" placeholder="••••••••" />
            <Button type="submit" fullWidth>
              تسجيل الدخول
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-muted">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="font-semibold text-brand-olive-700 hover:underline">
              إنشاء حساب
            </Link>
          </p>
        </div>
      </AuthLayout>
    </motion.div>
  );
}
