import { useMutation, useQuery } from '@tanstack/react-query'
import { notificationsApi } from '../api/notificationsApi'
import { notificationsKeys } from './keys'

export function useNotifications(params: Record<string, any> = {}){
  return useQuery({ queryKey: notificationsKeys.list(params), queryFn: () => notificationsApi.list(params), keepPreviousData: true })
}

export function useMarkRead(){
  return useMutation((ids: number[]) => notificationsApi.markRead(ids))
}
