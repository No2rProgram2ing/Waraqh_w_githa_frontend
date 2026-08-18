import { useMutation, useQuery } from '@tanstack/react-query'
import { notificationsApi } from '../api/notificationsApi'
import { notificationsKeys } from './keys'
import type { NotificationItem } from '../types/notification.types'

interface NotificationsListResponse {
  data: NotificationItem[]
}

export function useNotifications(params: Record<string, any> = {}) {
  return useQuery<NotificationsListResponse>({
    queryKey: notificationsKeys.list(params),
    queryFn: () => notificationsApi.list(params),
  })
}

export function useMarkRead() {
  return useMutation({
    mutationFn: (ids: number[]) => notificationsApi.markRead(ids),
  })
}