import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { AdminProfile, UpdateProfilePayload } from '../types/profile'

export interface ProfileResponse {
    data: AdminProfile
}

export const profileApi = {
    async getProfile(): Promise<AdminProfile> {
        const response = await axiosAdminClient.get<ProfileResponse>('/admin/profile') // Placeholder endpoint
        return response.data.data
    },

    async updateProfile(data: UpdateProfilePayload): Promise<AdminProfile> {
        const response = await axiosAdminClient.put<ProfileResponse>('/admin/profile', data) // Placeholder endpoint
        return response.data.data
    }
}
