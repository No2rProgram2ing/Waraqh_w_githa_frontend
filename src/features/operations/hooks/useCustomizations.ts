import { useMutation, useQuery } from '@tanstack/react-query'
import { customizationsApi } from '../api/customizationsApi'
import { customizationsKeys } from './keys'

export function useEstimateCustomization(payload: Record<string, any>) {
  return useMutation(() => customizationsApi.estimate(payload))
}

export function useCreateCustomization() {
  return useMutation((payload: FormData) => customizationsApi.create(payload))
}

export function useSaveDraft(id: number | null) {
  return useMutation((payload: Record<string, any>) => customizationsApi.saveDraft(id, payload))
}
