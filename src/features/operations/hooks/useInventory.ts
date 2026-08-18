import { useMutation, useQuery } from '@tanstack/react-query'
import { inventoryApi } from '../api/inventoryApi'
import { inventoryKeys } from './keys'

export function useMaterials(params: Record<string, any> = {}){
  return useQuery({ queryKey: inventoryKeys.materials(params), queryFn: () => inventoryApi.listMaterials(params), staleTime: 60*1000 })
}

export function useMovements(params: Record<string, any> = {}){
  return useQuery({ queryKey: inventoryKeys.movements(params), queryFn: () => inventoryApi.getMovements(params), staleTime: 60*1000 })
}

export function useAdjustStock(){
  return useMutation((payload: Record<string, any>) => inventoryApi.adjustStock(payload))
}
