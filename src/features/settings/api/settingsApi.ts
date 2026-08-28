import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { SystemSettings, UpdateSettingsPayload } from '../types/settings'

export interface SettingsResponse {
    data: SystemSettings
}

export const settingsApi = {
    async getSettings(): Promise<SystemSettings> {
        const response = await axiosAdminClient.get<SettingsResponse>('/admin/settings') // Placeholder endpoint
        return response.data.data
    },

    async updateSettings(data: UpdateSettingsPayload): Promise<SystemSettings> {
        const response = await axiosAdminClient.put<SettingsResponse>('/admin/settings', data) // Placeholder endpoint
        return response.data.data
    }
}
