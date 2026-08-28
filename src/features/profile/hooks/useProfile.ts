import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, type UpdateProfileParams, type UpdatePasswordParams } from "@/api/profileApi";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("فشل تحويل الصورة إلى بيانات قابلة للتخزين."));
    reader.readAsDataURL(file);
  });

export const PROFILE_QUERY_KEY = ["userProfile"];

export function useProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileApi.getProfile(),
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;
      return status !== 401 && failureCount < 2;
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (params: UpdateProfileParams) => profileApi.updateProfile(params),
    onSuccess: async (updatedProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);
      await queryClient.invalidateQueries({ queryKey: ["customer-me"] });
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      const currentUser = useCustomerAuthStore.getState().user;
      if (!currentUser) return;

      useCustomerAuthStore.getState().setUser({
        ...currentUser,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        phone: updatedProfile.phone || currentUser.phone || null,
        avatar: updatedProfile.avatarUrl ?? currentUser.avatar ?? currentUser.avatarUrl ?? null,
        avatarUrl: updatedProfile.avatarUrl ?? currentUser.avatarUrl ?? currentUser.avatar ?? null,
      });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const dataUrl = await fileToDataUrl(file);
      const updatedProfile = await profileApi.updateAvatar(file);
      return { updatedProfile, dataUrl };
    },
    onSuccess: async ({ updatedProfile, dataUrl }) => {
      const currentUser = useCustomerAuthStore.getState().user;
      const nextAvatarUrl =
        updatedProfile.avatarUrl || dataUrl || currentUser?.avatarUrl || currentUser?.avatar || null;

      queryClient.setQueryData(PROFILE_QUERY_KEY, {
        ...(profileQuery.data ?? {}),
        ...updatedProfile,
        avatarUrl: nextAvatarUrl,
      });
      await queryClient.invalidateQueries({ queryKey: ["customer-me"] });
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      if (!currentUser) return;

      useCustomerAuthStore.getState().setUser({
        ...currentUser,
        fullName: updatedProfile.fullName || currentUser.fullName,
        email: updatedProfile.email || currentUser.email,
        phone: updatedProfile.phone || currentUser.phone || null,
        avatar: nextAvatarUrl,
        avatarUrl: nextAvatarUrl,
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (params: UpdatePasswordParams) => profileApi.updatePassword(params),
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateAvatar: updateAvatarMutation.mutateAsync,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
}
