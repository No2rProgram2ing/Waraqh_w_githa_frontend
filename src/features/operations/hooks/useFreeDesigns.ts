import {
  keepPreviousData,
  useMutation,
  useQuery,
} from '@tanstack/react-query'

import {
  freeDesignApi,
  type AssignFreeDesignPayload,
} from '../api/freeDesignApi'

import { freeDesignKeys } from './keys'

export function useFreeDesigns(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: freeDesignKeys.list(params),
    queryFn: () => freeDesignApi.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useAssignFreeDesign() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: AssignFreeDesignPayload
    }) => freeDesignApi.assign(id, payload),
  })
}