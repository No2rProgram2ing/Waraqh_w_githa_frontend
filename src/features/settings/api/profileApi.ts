import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { AdminProfile, UpdateProfilePayload } from '../types/profile'

export interface ProfileResponse {
    data: AdminProfile
}

export const profileApi = {
    async getProfile(): Promise<AdminProfile> {
        const response = await axiosAdminClient.get<ProfileResponse>('/admin/profile')
        return response.data.data
    },

    async updateProfile(data: UpdateProfilePayload): Promise<AdminProfile> {
        const formData = new FormData()

        formData.append('_method', 'PUT')
        formData.append('first_name', data.first_name)
        formData.append('last_name', data.last_name)
        formData.append('email', data.email)

        if (data.avatar instanceof File) {
            formData.append('avatar', data.avatar)
        }

        if (data.current_password) formData.append('current_password', data.current_password)
        if (data.password) formData.append('password', data.password)
        if (data.password_confirmation) formData.append('password_confirmation', data.password_confirmation)

        const response = await axiosAdminClient.post<ProfileResponse>('/admin/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        return response.data.data
    }
}
