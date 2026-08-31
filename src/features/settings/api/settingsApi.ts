import { adminClient } from '@/lib/api/adminClient'
import type { SystemSettings, UpdateSettingsPayload } from '../types/settings'

export interface SettingsResponse {
    data: SystemSettings
}

export const settingsApi = {
    async getSettings(): Promise<SystemSettings> {
        const response = await adminClient.get<SettingsResponse>('/admin/settings') // Placeholder endpoint
        return response.data.data
    },

    async updateSettings(data: UpdateSettingsPayload): Promise<SystemSettings> {
        const response = await adminClient.put<SettingsResponse>('/admin/settings', data) // Placeholder endpoint
        return response.data.data
    }
}
