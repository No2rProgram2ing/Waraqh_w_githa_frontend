import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { UserProfileData } from "@/api/profileApi";
import { extractFieldErrors, extractMessage } from "@/utils/apiErrors";
import { showErrorToast } from "@/lib/toast";

export interface PersonalInfoFormProps {
  profile?: UserProfileData;
  onSubmit: (data: { fullName: string; email: string; phone: string }) => Promise<void>;
  isLoading?: boolean;
}

export function PersonalInfoForm({ profile, onSubmit, isLoading }: PersonalInfoFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setEmail(profile.email);
      setPhone(profile.phone);
    }
    setFieldErrors({});
    setSubmitError("");
  }, [profile]);

  const readError = (...keys: string[]) =>
    keys.map((key) => fieldErrors[key]).find((value) => Boolean(value)) ?? "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError("");

    try {
      await onSubmit({ fullName, email, phone });
    } catch (error) {
      const mappedErrors = extractFieldErrors(error);
      setFieldErrors(mappedErrors);

      const message = extractMessage(error, "حدث خطأ أثناء حفظ التغييرات");
      setSubmitError(message);
      showErrorToast(message);
    }
  };

  return (
    <Card className="border border-brand-border/80 bg-brand-surface/40 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="أحمد اليمني"
            required
            error={readError("fullName", "full_name")}
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ahmed@example.com"
            required
            dir="ltr"
            error={readError("email")}
          />
        </div>

        <div className="w-full sm:w-1/2">
          <Input
            label="رقم الهاتف"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+967 777 000 000"
            required
            dir="ltr"
            error={readError("phone")}
          />
        </div>

        <div className="flex justify-start pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            variant="primary"
            className="min-w-[160px]"
          >
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </Card>
  );
}
