import { useEffect } from "react";
import { motion } from "framer-motion";
import { AccountLayout } from "@/layouts/AccountLayout";
import { ProfileHeader } from "../components/ProfileHeader";
import { PersonalInfoForm } from "../components/PersonalInfoForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { useProfile } from "../hooks/useProfile";
import { Loader } from "@/components/ui/Loader";
import { TrashIcon } from "@/components/ui/icons";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { extractMessage } from "@/utils/apiErrors";

export function PersonalInfoPage() {
  const {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    updateProfile,
    isUpdatingProfile,
    updatePassword,
    isUpdatingPassword,
  } = useProfile();

  useEffect(() => {
    if (isError && error) {
      const message = extractMessage(error, "حدث خطأ أثناء جلب بيانات الملف الشخصي.");
      showErrorToast(message);
    }
  }, [isError, error]);

  const handleUpdateProfile = async (data: { fullName: string; email: string; phone: string }) => {
    await updateProfile(data);
    showSuccessToast("تم حفظ التغييرات بنجاح");
  };

  const handleUpdatePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    const result = await updatePassword(data);
    showSuccessToast(result.message);
  };

  if (isError && !profile) {
    return (
      <AccountLayout>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p className="text-sm font-medium">حدث خطأ أثناء جلب بيانات الملف الشخصي.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
            >
              إعادة المحاولة
            </button>
          </div>
        </motion.div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
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
            <ProfileHeader
              fullName={profile?.fullName}
              avatarUrl={profile?.avatarUrl}
              isOnline={profile?.isOnline}
            />

            <PersonalInfoForm
              profile={profile}
              onSubmit={handleUpdateProfile}
              isLoading={isUpdatingProfile}
            />

            <ChangePasswordForm
              onSubmit={handleUpdatePassword}
              isLoading={isUpdatingPassword}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-brand-border/60">
              <button
                type="button"
                onClick={() => showSuccessToast("تأكيد: هل أنت متأكد من رغبتك في حذف الحساب؟")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                <TrashIcon className="w-4 h-4 shrink-0" />
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
