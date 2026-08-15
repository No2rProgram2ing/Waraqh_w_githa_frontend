import { useState } from "react";
import { motion } from "framer-motion";
import { AccountLayout } from "@/layouts/AccountLayout";
import { ProfileHeader } from "../components/ProfileHeader";
import { PersonalInfoForm } from "../components/PersonalInfoForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { useProfile } from "../hooks/useProfile";
import { Toast } from "@/components/ui/Toast";
import { Loader } from "@/components/ui/Loader";
import { TrashIcon } from "@/components/ui/icons";


export function PersonalInfoPage() {
  const { profile, isLoading, updateProfile, isUpdatingProfile, updatePassword, isUpdatingPassword } = useProfile();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateProfile = async (data: { fullName: string; email: string; phone: string }) => {
    try {
      await updateProfile(data);
      setToastMessage("تم حفظ التغييرات بنجاح");
    } catch {
      setToastMessage("حدث خطأ أثناء حفظ التغييرات");
    }
  };

  const handleUpdatePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const res = await updatePassword(data);
      setToastMessage(res.message);
    } catch {
      setToastMessage("حدث خطأ أثناء تحديث كلمة المرور");
    }
  };

  return (
    <AccountLayout>
      <Toast
        isVisible={Boolean(toastMessage)}
        message={toastMessage || ""}
        onClose={() => setToastMessage(null)}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-10"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader />
            <span className="text-sm text-brand-muted">جاري تحميل البيانات...</span>
          </div>
        ) : (
          <>
            {/* Header with Avatar */}
            <ProfileHeader
              fullName={profile?.fullName}
              avatarUrl={profile?.avatarUrl}
              isOnline={profile?.isOnline}
            />

            {/* Form 1: Personal Info */}
            <PersonalInfoForm
              profile={profile}
              onSubmit={handleUpdateProfile}
              isLoading={isUpdatingProfile}
            />

            {/* Form 2: Security Change Password */}
            <ChangePasswordForm
              onSubmit={handleUpdatePassword}
              isLoading={isUpdatingPassword}
            />

            {/* Account Actions & Subtext */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-brand-border/60">
              <button
                type="button"
                onClick={() => setToastMessage("تأكيد: هل أنت أثر برغبتك في حذف الحساب؟")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                <TrashIcon />
                <span>حذف الحساب نهائياً</span>
              </button>

              <span className="text-xs text-brand-muted font-medium">
                عضو منذ {profile?.joinedDate || "يناير 2023"}
              </span>
            </div>
          </>
        )}
      </motion.div>
    </AccountLayout>
  );
}
