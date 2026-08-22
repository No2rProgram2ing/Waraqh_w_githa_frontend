import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productionApi } from '../api/productionApi'
import { ordersKeys } from './keys'

export function useProductionHistory(orderId?: number | null) {
  return useQuery({ queryKey: [...ordersKeys.detail(orderId ?? 'production'), 'production'], queryFn: () => orderId ? productionApi.getHistory(orderId) : Promise.resolve({ data: [] }), enabled: !!orderId, staleTime: 30_000 })
}
export function useUpdateProductionStage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, stageId }: { orderId: number; stageId: number }) => productionApi.updateStage(orderId, stageId),
    onSuccess: (_data, variables) => { queryClient.invalidateQueries({ queryKey: [...ordersKeys.detail(variables.orderId), 'production'] }); queryClient.invalidateQueries({ queryKey: ordersKeys.detail(variables.orderId) }) },
  })
}


export function useProductionStages() {
  return useQuery({
    queryKey: ['admin', 'production-stages'],
    queryFn: () => productionApi.getStages(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}
