import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { freeDesignApi } from '../api/freeDesignApi'

export const freeDesignKeys = {
  all: ['admin', 'custom-design-requests'] as const,

  list: (params: Record<string, unknown>) =>
    [...freeDesignKeys.all, 'list', params] as const,

  detail: (id: number) =>
    [...freeDesignKeys.all, 'detail', id] as const,
}

export function useFreeDesigns(params: Record<string, unknown>) {
  return useQuery({
    queryKey: freeDesignKeys.list(params),
    queryFn: () =>
      freeDesignApi.list(
        params as Parameters<typeof freeDesignApi.list>[0],
      ),
  })
}

export function useFreeDesign(id: number) {
  return useQuery({
    queryKey: freeDesignKeys.detail(id),
    queryFn: () => freeDesignApi.show(id),
    enabled: Number.isFinite(id),
  })
}

export function useUpdateFreeDesign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: FormData
    }) => freeDesignApi.update(id, payload),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: freeDesignKeys.all,
      })

      void queryClient.invalidateQueries({
        queryKey: freeDesignKeys.detail(variables.id),
      })
    },
  })
}

export function useDeleteFreeDesignImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      imageId,
    }: {
      requestId: number
      imageId: number
    }) => freeDesignApi.deleteImage(requestId, imageId),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: freeDesignKeys.detail(variables.requestId),
      })

      void queryClient.invalidateQueries({
        queryKey: freeDesignKeys.all,
      })
    },
  })
}

export function useDeleteFreeDesign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => freeDesignApi.remove(id),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: freeDesignKeys.all,
      })
    },
  })
}

export function useCreateFreeDesign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FormData) =>
      freeDesignApi.create(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: freeDesignKeys.all,
      })
    },
  })
}
