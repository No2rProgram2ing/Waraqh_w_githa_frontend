import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";
import { ShieldCheckIcon, ArrowRightIcon } from "@/components/ui/icons";
import { clsx } from "clsx";
import { ROUTES } from "@/routes/paths";

export function OtpVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (value: string, index: number) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
    <AuthLayout panel={<AuthHeroPanel />}>

        <div className="mx-auto w-full max-w-md flex flex-col justify-center text-end">
          
          <Link
            to={ROUTES.signup}
            className="inline-flex items-center gap-2 text-xs font-medium text-brand-muted hover:text-brand-ink transition-colors mb-8 self-start"
          >
            <span className="text-sm">➔</span> رجوع لإنشاء الحساب
          </Link>

          <h1 className="text-3xl font-bold text-brand-olive-700 leading-tight text-center">
            تأكيد هويتك
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-brand-muted max-w-sm">
            لقد أرسلنا رمز التأكيد إلى هاتفك لضمان أمان حسابك. يرجى إدخال الرمز المكون من 4 أرقام للمتابعة.
          </p>

          <form
            className="mt-10 flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert(`تم إدخال الرمز: ${otp.join("")}`);
            }}
          >
            {/* إضافة dir="ltr" لترتيب مربعات الإدخال من اليسار إلى اليمين */}
            <div className="grid grid-cols-4 gap-4 w-full" dir="ltr">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el!)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={clsx(
                    "flex h-20 w-full items-center justify-center rounded-xl border bg-brand-surface text-center text-3xl font-bold",
                    "text-brand-ink placeholder:text-brand-muted border-stone-200",
                    "transition-all duration-200 ease-out",
                    "focus:outline-none focus:ring-2 focus:ring-brand-olive-600 focus:border-transparent"
                  )}
                />
              ))}
            </div>

            <Button type="submit" fullWidth className="gap-2.5 mt-2 bg-brand-olive-700 hover:bg-brand-olive-900">
              {/* الترتيب: النص أولاً ثم الأيقونة لتظهر الأيقونة بعد النص في RTL */}
              <span className="text-base font-bold">تأكيد الحساب</span>
              <ShieldCheckIcon className="h-5 w-5" />
            </Button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-brand-muted">
              لم يصلك الرمز؟{" "}
              <button
                type="button"
                className="font-semibold text-brand-olive-700 hover:underline cursor-pointer"
              >
                إعادة إرسال الرمز
              </button>
            </p>
            <p className="text-sm text-brand-muted">
              يمكنك طلب رمز جديد خلال <span className="font-bold text-brand-ink">02:00</span> دقيقة
            </p>
          </div>

          <p className="mt-10 text-center text-xs text-brand-muted">
            هل تواجه صعوبة؟{" "}
            <button type="button" className="text-brand-olive-700 underline font-medium cursor-pointer">
              تحدث إلى فريق الدعم الفني
            </button>
          </p>
          
          <hr className="mt-12 mb-10 border-t border-brand-border/70" />
          
          <Link
            to={ROUTES.login}
            className="mt-6 text-center text-sm font-medium text-brand-olive-700 hover:underline"
          >
             العودة لتسجيل الدخول <ArrowRightIcon className="h-3.5 w-3.5 inline" />
          </Link>
        </div>
      </AuthLayout>
    </motion.div>
  );
}

export default OtpVerificationPage;