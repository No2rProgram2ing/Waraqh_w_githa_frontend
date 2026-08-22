import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '../api/inventoryApi'
import { inventoryKeys } from './keys'

export function useMaterials(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: inventoryKeys.materials(params),
    queryFn: () => inventoryApi.listMaterials(),
    staleTime: 30_000,
  })
}

export function useMaterial(id?: number | null) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'material', id],
    queryFn: () => inventoryApi.getById(Number(id)),
    enabled: !!id,
  })
}

export function useCreateMaterial() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => inventoryApi.create(payload),
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'inventory', 'materials'] }),
  })
}

export function useUpdateMaterial() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => inventoryApi.update(id, payload),
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'inventory', 'materials'] }),
  })
}

export function useDeleteMaterial() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => inventoryApi.delete(id),
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'inventory', 'materials'] }),
  })
}
