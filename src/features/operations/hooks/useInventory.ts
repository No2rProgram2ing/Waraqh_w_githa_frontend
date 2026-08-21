import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '../api/inventoryApi'
import { inventoryKeys } from './keys'

export function useMaterials(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: inventoryKeys.materials(params),
    queryFn: () => inventoryApi.listMaterials(params),
  })
}

export function useMovements(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: inventoryKeys.movements(params),
    queryFn: () => inventoryApi.getMovements(params),
  })
}

export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Record<string, any>) => inventoryApi.adjustStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}