import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '../api/settingsApi'
import type { UpdateSettingsPayload } from '../types/settings'

export const settingsKeys = {
    all: ['admin', 'settings'] as const,
    detail: () => [...settingsKeys.all, 'detail'] as const,
}

export function useSettings() {
    return useQuery({
        queryKey: settingsKeys.detail(),
        queryFn: () => settingsApi.getSettings(),
    })
}

export function useUpdateSettings() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateSettingsPayload) => settingsApi.updateSettings(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: settingsKeys.detail() })
        },
    })
}
