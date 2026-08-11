import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا تستدعي الـ API الخاص بطلب الرابط، ثم توجه المستخدم لشاشة تفقد البريد
    navigate("/check-email");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <AuthLayout panel={<AuthHeroPanel />}>
        <div className="mx-auto w-full max-w-md flex flex-col justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-medium text-brand-muted hover:text-brand-ink transition-colors mb-8 self-start"
          >
            <span className="text-sm">➔</span> رجوع لتسجيل الدخول
          </Link>

          <h1 className="text-2xl font-bold text-brand-ink leading-tight">
            لا مشكلة، سنساعدك على استعادة حسابك
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            أدخل بريدك الإلكتروني أو رقم هاتفك وسنرسل لك رابطاً آمناً للبدء من جديد. نحن نهتم بأمن بياناتك وخصوصيتك.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              label="البريد الإلكتروني أو رقم الهاتف"
              type="text"
              placeholder="name@example.com"
              autoComplete="username"
              required
            />

            <Button type="submit" fullWidth className="gap-2">
              <span>إرسال رابط إعادة التعيين</span>
              <span className="text-base leading-none">➢</span>
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-brand-muted">
            هل تواجه صعوبة؟{" "}
            <button type="button" className="text-brand-olive-700 underline font-medium">
              تحدث إلى فريق الدعم الفني
            </button>
          </p>
        </div>
      </AuthLayout>
    </motion.div>
  );
}