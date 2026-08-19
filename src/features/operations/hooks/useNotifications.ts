import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import { notificationsApi } from '../api/notificationsApi'
import { notificationsKeys } from './keys'

export function useNotifications(params: Record<string, any> = {}){
  return useQuery({ queryKey: notificationsKeys.list(params), queryFn: () => notificationsApi.list(params), placeholderData: keepPreviousData })
}

export function useMarkRead(){
  return useMutation({
    mutationFn: (ids: number[]) => notificationsApi.markRead(ids)
  })
}
