import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

export interface ChangePasswordFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  isLoading?: boolean;
}

export function ChangePasswordForm({ onSubmit, isLoading }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    await onSubmit({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="flex flex-col gap-6 pt-6 border-t border-brand-border/60">
      <h3 className="text-xl font-bold text-brand-ink font-display">تغيير كلمة المرور</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
        <Input
          label="كلمة المرور الحالية"
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          required
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

        <div className="flex justify-start pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            variant="outline"
            className="min-w-[180px] bg-stone-600 text-white hover:bg-stone-700 border-none"
          >
            تحديث كلمة المرور
          </Button>
        </div>
      </form>
    </div>
  );
}
