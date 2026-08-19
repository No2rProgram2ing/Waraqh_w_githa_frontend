import { useMutation, useQuery } from '@tanstack/react-query'
import { productionApi } from '../api/productionApi'
import { ordersKeys } from './keys'

export function useProductionHistory(orderId?: number | null){
  return useQuery({ queryKey: ordersKeys.detail(orderId ?? 'production'), queryFn: () => (orderId ? productionApi.getHistory(orderId) : Promise.resolve({ data: [] })), enabled: !!orderId })
}

export function useUpdateProductionStage(){
  return useMutation({
    mutationFn: ({ orderId, stageKey, payload }: { orderId: number; stageKey: string; payload: Record<string, any> }) => productionApi.updateStage(orderId, stageKey, payload)
  })
}
