import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeroPanel } from "@/features/auth-customer/components/AuthHeroPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldCheckIcon, ArrowRightIcon } from "@/components/ui/icons";
import { clsx } from "clsx";
import { ROUTES } from "@/routes/paths";
import {
  useCustomerVerification,
  useGenerateCustomerVerification,
} from "@/features/auth-customer/hooks/useCustomerAuth";

const otpLength = 6;

export function OtpVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const contactValue = (() => {
    const state = location.state as { contactValue?: string } | null;
    return state?.contactValue ?? "";
  })();
  const [otp, setOtp] = useState(Array.from({ length: otpLength }, () => ""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const verifyMutation = useCustomerVerification();
  const generateMutation = useGenerateCustomerVerification();
  const [isVerified, setIsVerified] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(() => (contactValue ? 60 : 0));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const normalizeContactValue = (value: string) => value.trim();

  const purpose = "signup_email_verification";

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const getApiErrorMessage = (error: unknown, fallback: string) => {
    const responseMessage = (
      error as { response?: { data?: { message?: unknown } } }
    ).response?.data?.message;

    return typeof responseMessage === "string"
      ? responseMessage
      : fallback;
  };

  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value) || value.length > 1) {
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleGenerateCode = async () => {
    const normalized = normalizeContactValue(contactValue);
    if (!isValidEmail(normalized)) {
      return;
    }

    generateMutation.mutate({
        purpose,
        contact_value: normalized,
      }, {
        onSuccess: () => {
          setResendSeconds(60);
        },
        onError: (error) => {
          if ((error as { response?: { status?: number } }).response?.status === 404) {
            navigate(ROUTES.signup, {
              replace: true,
              state: {
                verificationError: "تعذر العثور على الحساب. أنشئ الحساب أولاً ثم اطلب رمز التحقق.",
              },
            });
          }
        },
      });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const code = otp.join("");
    const normalized = normalizeContactValue(contactValue);
    if (!isValidEmail(normalized) || code.length !== otpLength) {
      return;
    }

    try {
      await verifyMutation.mutateAsync({
        purpose,
        contact_value: normalized,
        code_or_token: code,
      });
      setIsVerified(true);
      window.setTimeout(() => navigate(ROUTES.login, { replace: true }), 1200);
    } catch {
      // The mutation error is rendered below.
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
            أدخل البريد الإلكتروني ثم اطلب الرمز، وبعدها أدخل الرمز المكون من 6 أرقام للتحقق.
          </p>

          <div className="mt-8">
            <Input
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              value={contactValue}
              readOnly
              disabled={!contactValue}
              placeholder="سيظهر البريد المستخدم في التسجيل هنا"
            />
            {!contactValue && (
              <p role="alert" className="mt-2 text-sm text-red-500">
                افتح صفحة التحقق من خلال التسجيل حتى نستخدم البريد المسجل في الخلفية.
              </p>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleGenerateCode}
                disabled={resendSeconds > 0}
                isLoading={generateMutation.isPending}
              >
                {resendSeconds > 0 ? `يمكن إعادة الإرسال بعد ${resendSeconds} ثانية` : "إرسال الرمز"}
              </Button>
            </div>
          </div>

          <form className="mt-10 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-6 gap-2 w-full" dir="ltr">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(event) => handleInputChange(event.target.value, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={clsx(
                    "flex h-14 w-full items-center justify-center rounded-xl border bg-brand-surface text-center text-2xl font-bold",
                    "text-brand-ink placeholder:text-brand-muted border-stone-200",
                    "transition-all duration-200 ease-out",
                    "focus:outline-none focus:ring-2 focus:ring-brand-olive-600 focus:border-transparent"
                  )}
                />
              ))}
            </div>

            {generateMutation.isError && (
              <p role="alert" className="text-sm text-red-500">
                {getApiErrorMessage(generateMutation.error, "تعذر إرسال الرمز.")}
              </p>
            )}

            {verifyMutation.isError && (
              <p role="alert" className="text-sm text-red-500">
                {getApiErrorMessage(verifyMutation.error, "تعذر التحقق من الرمز.")}
              </p>
            )}

            {isVerified && (
              <p role="status" className="text-sm text-brand-olive-700">
                تم تأكيد البريد الإلكتروني بنجاح. جارٍ تحويلك لتسجيل الدخول...
              </p>
            )}

            <Button type="submit" fullWidth disabled={isVerified} className="gap-2.5 mt-2 bg-brand-olive-700 hover:bg-brand-olive-900" isLoading={verifyMutation.isPending}>
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
                onClick={handleGenerateCode}
                disabled={resendSeconds > 0 || generateMutation.isPending}
              >
                {resendSeconds > 0 ? `إعادة الإرسال بعد ${resendSeconds} ثانية` : "إعادة إرسال الرمز"}
              </button>
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
