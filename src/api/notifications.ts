import { customerApi } from "@/api/customerApi";

export interface NotificationData {
  [key: string]: unknown;
}

export interface Notification {
  id: string | number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationListResponse {
  data: Notification[];
}

interface UnreadCountResponse { unread_count: number; }

export interface NotificationActionResponse {
  message?: string;
  notification?: Notification;
}

function extractNotifications(response: Notification[] | NotificationListResponse): Notification[] {
  return Array.isArray(response) ? response : response.data;
}

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await customerApi.get<Notification[] | NotificationListResponse>("/customer/notifications");
    return extractNotifications(data);
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await customerApi.get<UnreadCountResponse>("/customer/notifications/unread-count");
    return data.unread_count;
  },

  markAsRead: async (id: string | number): Promise<NotificationActionResponse> => {
    const { data } = await customerApi.patch<NotificationActionResponse>(`/customer/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<NotificationActionResponse> => {
    const { data } = await customerApi.patch<NotificationActionResponse>("/customer/notifications/read-all");
    return data;
  },

  delete: async (id: string | number): Promise<NotificationActionResponse> => {
    const { data } = await customerApi.delete<NotificationActionResponse>(`/customer/notifications/${id}`);
    return data;
  },
};