import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '../api/profileApi'
import type { UpdateProfilePayload } from '../types/profile'

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
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: profileKeys.detail() })
        },
    })
}
