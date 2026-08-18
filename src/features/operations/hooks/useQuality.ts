import { useMutation, useQuery } from '@tanstack/react-query'
import { qualityApi } from '../api/qualityApi'
import { qualityKeys } from './keys'

export function useQualityReviews(params: Record<string, any> = {}){
  return useQuery({
    queryKey: qualityKeys.list(params),
    queryFn: () => qualityApi.list(params),
    staleTime: 60 * 1000,
    keepPreviousData: true,
  })
}

export function useQualityReview(id?: number | null){
  return useQuery({
    queryKey: qualityKeys.detail(id ?? 'null'),
    queryFn: () => (id ? qualityApi.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  })
}

export function useApproveReview(){
  return useMutation(({ id, payload }: { id: number; payload?: Record<string, any> }) => qualityApi.approve(id, payload))
}

export function useRejectReview(){
  return useMutation(({ id, payload }: { id: number; payload?: Record<string, any> }) => qualityApi.reject(id, payload))
}
