import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, type UpdateProfileParams, type UpdatePasswordParams } from "@/api/profileApi";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";

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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);

      const currentUser = useCustomerAuthStore.getState().user;
      if (!currentUser) return;

      useCustomerAuthStore.getState().setUser({
        ...currentUser,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        phone: updatedProfile.phone || currentUser.phone || null,
        avatarUrl: updatedProfile.avatarUrl ?? currentUser.avatarUrl ?? null,
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
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
}
