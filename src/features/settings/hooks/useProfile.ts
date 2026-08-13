import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAdminAuthStore } from '@/features/auth/stores/adminAuthStore'
import { profileApi } from '../api/profileApi'
import type { AdminProfile, UpdateProfilePayload } from '../types/profile'

export const profileKeys = {
    all: ['admin', 'profile'] as const,
    detail: () => [...profileKeys.all, 'detail'] as const,
}

export function useProfile() {
    return useQuery({
        queryKey: profileKeys.detail(),
        queryFn: () => profileApi.getProfile(),
    })
}

export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateProfilePayload) => profileApi.updateProfile(data),
        onSuccess: async (updatedProfile: AdminProfile) => {
            await queryClient.invalidateQueries({ queryKey: profileKeys.detail() })

            const currentAdmin = useAdminAuthStore.getState().admin
            if (!currentAdmin) return

            const fullName = `${updatedProfile.first_name} ${updatedProfile.last_name}`.trim()

            useAdminAuthStore.getState().updateAdmin({
                ...currentAdmin,
                full_name: fullName || currentAdmin.full_name,
                email: updatedProfile.email,
                avatar_url: updatedProfile.avatar_url ?? currentAdmin.avatar_url,
            })
        },
    })
}
