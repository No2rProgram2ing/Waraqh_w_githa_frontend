import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, type UpdateProfileParams, type UpdatePasswordParams } from "@/api/profileApi";

export const PROFILE_QUERY_KEY = ["userProfile"];

export function useProfile() {
  const queryClient = useQueryClient();

  // Query profile data
  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileApi.getProfile(),
  });

  // Mutation to update personal details
  const updateProfileMutation = useMutation({
    mutationFn: (params: UpdateProfileParams) => profileApi.updateProfile(params),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);
    },
  });

  // Mutation to update password
  const updatePasswordMutation = useMutation({
    mutationFn: (params: UpdatePasswordParams) => profileApi.updatePassword(params),
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
}
