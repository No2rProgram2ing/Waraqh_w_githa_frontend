import { redirectToGoogleLogin } from "@/features/auth-customer/services/googleAuth";
import { showErrorToast } from "@/lib/toast";

interface GoogleLoginButtonProps {
  isLoading?: boolean;
  label?: string;
}

export function GoogleLoginButton({
  isLoading = false,
  label = "الدخول باستخدام Google",
}: GoogleLoginButtonProps) {
  const handleLogin = () => {
    try {
      redirectToGoogleLogin();
    } catch {
      showErrorToast("تعذر بدء تسجيل الدخول عبر Google، يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d8d3ca] bg-white px-4 py-3 text-sm font-semibold text-[#1d2218] shadow-[0_12px_18px_-16px_rgba(28,34,24,0.5)] transition hover:bg-[#f7f4f1] disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={label}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3f5f0] text-base font-bold text-[#4f5f3d]">
        G
      </span>
      <span>{isLoading ? "جارٍ التحضير..." : label}</span>
    </button>
  );
}
