import { useMutation, useQuery } from '@tanstack/react-query'
import { returnsApi } from '../api/returnsApi'
import { returnsKeys } from './keys'

export function useReturns(params: Record<string, any> = {}){
  return useQuery({ queryKey: returnsKeys.list(params), queryFn: () => returnsApi.list(params), keepPreviousData: true })
}

export function useReturn(id?: number | null){
  return useQuery({ queryKey: returnsKeys.detail(id ?? 'null'), queryFn: () => (id ? returnsApi.getById(id) : Promise.resolve(null)), enabled: !!id })
}

export function useCreateReturn(){
  return useMutation((payload: FormData) => returnsApi.create(payload))
}
