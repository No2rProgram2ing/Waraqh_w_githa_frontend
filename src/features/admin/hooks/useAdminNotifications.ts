import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminClient } from '@/lib/api/adminClient';

export interface AdminNotification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        message?: string;
        product_id?: number;
        stock_quantity?: number;
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export function useAdminNotifications() {
    return useQuery({
        queryKey: ['admin-notifications'],
        queryFn: async (): Promise<AdminNotification[]> => {
            const resp = await adminClient.get<{ data: AdminNotification[] }>('/notifications');
            return resp.data.data;
        },
        refetchInterval: 1000 * 60, // 60 seconds polling
    });
}

export function useMarkNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await adminClient.post('/notifications/mark-as-read', {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        }
    });
}
