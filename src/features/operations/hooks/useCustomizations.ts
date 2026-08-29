import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customizationsApi } from '../api/customizationsApi'
import type { CustomizationStatus } from '../types/customizations.types'

export function useCustomizations() {
  return useQuery({
    queryKey: ['admin', 'customizations'],
    queryFn: () => customizationsApi.list(),
    staleTime: 30_000,
  })
}

export function useCustomization(id?: number | null) {
  return useQuery({
    queryKey: ['admin', 'customizations', 'detail', id],
    queryFn: () => customizationsApi.getById(Number(id)),
    enabled: !!id,
  })
}

export function useUpdateCustomizationStatus() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: CustomizationStatus }) =>
      customizationsApi.updateStatus(id, status),
    onSuccess: (_d, v) => {
      q.invalidateQueries({ queryKey: ['admin', 'customizations'] })
      q.invalidateQueries({ queryKey: ['admin', 'customizations', 'detail', v.id] })
    },
  })
}

export function useDeleteCustomization() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => customizationsApi.delete(id),
    onSuccess: () => {
      q.invalidateQueries({ queryKey: ['admin', 'customizations'] })
    },
  })
}

export function useCreateCustomization() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => customizationsApi.create(payload),
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'customizations'] }),
  })
}
