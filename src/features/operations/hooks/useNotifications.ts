import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { notificationsApi } from '../api/notificationsApi'
import { notificationsKeys } from './keys'
export function useNotifications(params:Record<string,unknown>={}){return useQuery({queryKey:notificationsKeys.list(params),queryFn:()=>notificationsApi.list(params),placeholderData:keepPreviousData})}
export function useMarkRead(){const q=useQueryClient();return useMutation({mutationFn:(id:number)=>notificationsApi.markRead(id),onSuccess:()=>q.invalidateQueries({queryKey:['admin','notifications']})})}
