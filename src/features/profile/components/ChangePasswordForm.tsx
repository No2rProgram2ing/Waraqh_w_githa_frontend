import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { RefreshCw as RefreshIcon } from "lucide-react";
import { clsx } from "clsx";
import { extractFieldErrors, extractMessage } from "@/utils/apiErrors";
import { showErrorToast } from "@/lib/toast";

export interface ChangePasswordFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
  isLoading?: boolean;
}

export function ChangePasswordForm({ onSubmit, isLoading }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const getError = (...keys: string[]) =>
    keys.map((key) => fieldErrors[key]).find((value) => Boolean(value)) ?? "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFieldErrors({
        current_password: currentPassword ? "" : "كلمة المرور الحالية مطلوبة",
        password: newPassword ? "" : "كلمة المرور الجديدة مطلوبة",
        password_confirmation: confirmPassword ? "" : "تأكيد كلمة المرور مطلوب",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldErrors({
        password: "كلمة المرور الجديدة غير متطابقة",
        password_confirmation: "تأكيد كلمة المرور غير متطابق",
      });
      return;
    }

    try {
      await onSubmit({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const mappedErrors = extractFieldErrors(error);
      setFieldErrors(mappedErrors);

      const message = extractMessage(error, "حدث خطأ أثناء تحديث كلمة المرور");
      setSubmitError(message);
      showErrorToast(message);
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-6 border-t border-brand-border/60">
      <h3 className="text-xl font-bold text-brand-ink font-display">تغيير كلمة المرور</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <Input
          label="كلمة المرور الحالية"
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          required
          error={getError("currentPassword", "current_password")}
          icon={
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="focus:outline-none pointer-events-auto"
            >
              {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          iconPosition="left"
        />

        <Input
          label="كلمة المرور الجديدة"
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          required
          error={getError("newPassword", "password")}
          icon={
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="focus:outline-none pointer-events-auto"
            >
              {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          iconPosition="left"
        />

        <Input
          label="تأكيد كلمة المرور الجديدة"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          error={getError("confirmPassword", "password_confirmation")}
          icon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="focus:outline-none pointer-events-auto"
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          iconPosition="left"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="min-w-[180px] bg-stone-600 text-white hover:bg-stone-700 border-none"
        >
          <RefreshIcon
            className={clsx("h-4 w-4 shrink-0 text-white", isLoading && "animate-spin")}
          />
          <span>تحديث كلمة المرور</span>
        </Button>
      </form>
    </div>
  );
}
