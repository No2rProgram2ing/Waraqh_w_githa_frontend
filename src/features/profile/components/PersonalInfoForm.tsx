import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { UserProfileData } from "@/api/profileApi";

export interface PersonalInfoFormProps {
  profile?: UserProfileData;
  onSubmit: (data: { fullName: string; email: string; phone: string }) => Promise<void>;
  isLoading?: boolean;
}

export function PersonalInfoForm({ profile, onSubmit, isLoading }: PersonalInfoFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setEmail(profile.email);
      setPhone(profile.phone);
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ fullName, email, phone });
  };

  return (
    <Card className="border border-brand-border/80 bg-brand-surface/40 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <Input
            label="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="أحمد اليمني"
            required
          />

          {/* Email */}
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ahmed@example.com"
            required
            dir="ltr"
          />
        </div>

        {/* Phone Number */}
        <div className="w-full sm:w-1/2">
          <Input
            label="رقم الهاتف"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+967 777 000 000"
            required
            dir="ltr"
          />
        </div>

        {/* Submit Button */}
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
