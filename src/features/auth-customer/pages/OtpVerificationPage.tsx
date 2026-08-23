import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
  const [contactValue, setContactValue] = useState("");
  const [otp, setOtp] = useState(Array.from({ length: otpLength }, () => ""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const verifyMutation = useCustomerVerification();
  const generateMutation = useGenerateCustomerVerification();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const normalizeContactValue = (value: string) => value.trim();

  const purpose = contactValue.includes("@")
    ? "signup_email_verification"
    : "signup_phone_verification";

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
    if (!normalizeContactValue(contactValue)) {
      return;
    }

    await generateMutation.mutateAsync({
      purpose,
      contact_value: normalizeContactValue(contactValue),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const code = otp.join("");
    if (!normalizeContactValue(contactValue) || code.length !== otpLength) {
      return;
    }

    await verifyMutation.mutateAsync({
      purpose,
      contact_value: normalizeContactValue(contactValue),
      code_or_token: code,
    });
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
            أدخل البريد الإلكتروني أو رقم الهاتف ثم اطلب الرمز، وبعدها أدخل الرمز المكون من 6 أرقام للتحقق.
          </p>

          <div className="mt-8">
            <Input
              label="البريد الإلكتروني أو رقم الهاتف"
              type="text"
              dir="ltr"
              value={contactValue}
              onChange={(event) => setContactValue(event.target.value)}
              placeholder="example@email.com أو 7xxxxxxxx"
            />
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="secondary" onClick={handleGenerateCode} isLoading={generateMutation.isPending}>
                إرسال الرمز
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
                {(generateMutation.error as { message?: string } | undefined)?.message ?? "تعذر إرسال الرمز."}
              </p>
            )}

            {verifyMutation.isError && (
              <p role="alert" className="text-sm text-red-500">
                {(verifyMutation.error as { message?: string } | undefined)?.message ?? "تعذر التحقق من الرمز."}
              </p>
            )}

            <Button type="submit" fullWidth className="gap-2.5 mt-2 bg-brand-olive-700 hover:bg-brand-olive-900" isLoading={verifyMutation.isPending}>
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
              >
                إعادة إرسال الرمز
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
