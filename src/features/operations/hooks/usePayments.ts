import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from '../api/paymentsApi'
import { paymentsKeys } from './keys'
import type { PaymentStatus } from '../types/payments.types'
export function usePayments(params:Record<string,unknown>={}){return useQuery({queryKey:paymentsKeys.list(params),queryFn:()=>paymentsApi.list(params),placeholderData:keepPreviousData,staleTime:60_000,refetchOnWindowFocus:false})}
export function usePayment(id?:number|null){return useQuery({queryKey:paymentsKeys.detail(id??'null'),queryFn:()=>paymentsApi.getById(Number(id)),enabled:id!=null,staleTime:60_000})}
export function useUpdatePaymentStatus(){const q=useQueryClient();return useMutation({mutationFn:({id,status,admin_note}:{id:number;status:PaymentStatus;admin_note?:string})=>paymentsApi.updateStatus(id,status,admin_note),onSuccess:(_d,v)=>{q.invalidateQueries({queryKey:['admin','payments']});q.invalidateQueries({queryKey:paymentsKeys.detail(v.id)})}})}

export function useDeletePayment() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => paymentsApi.delete(id),
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'payments'] }),
  })
}
