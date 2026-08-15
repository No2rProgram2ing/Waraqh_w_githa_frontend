import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";

export function CheckEmailPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <AuthLayout panel={<AuthHeroPanel />}>
        <div className="mx-auto w-full max-w-md flex flex-col items-center text-center justify-center">
          
          {/* أيقونة الظرف الزيتونية */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E5EAD7] text-brand-olive-700">
            <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-brand-ink">
            تفقد صندوق بريدك
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted max-w-sm">
            لقد أرسلنا رابطاً خاصاً لإعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى مراجعة الصندوق الوارد (أو مجلد الرسائل غير المرغوب فيها).
          </p>

          <div className="mt-8 w-full rounded-xl border border-stone-200/80 bg-stone-50/50 p-4 text-center text-sm text-brand-muted">
            <span className="block text-xs mb-1">لم يصلك الرابط؟</span>
            <button
              type="button"
              onClick={() => alert("تم إعادة الإرسال")}
              className="font-semibold text-brand-olive-700 hover:underline cursor-pointer"
            >
              إعادة الإرسال
            </button>
          </div>

          <div className="mt-6 w-full">
            <Link to="/login">
              <Button fullWidth>
                العودة لتسجيل الدخول ←
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    </motion.div>
  );
}