import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productMediaApi } from '../api/productMediaApi'
import { productMediaKeys } from './useProductMedia'

interface UploadMediaVariables {
  productId: number
  files: File[]
}

export function useUploadProductMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, files }: UploadMediaVariables) => {
      return productMediaApi.upload(productId, files)
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: productMediaKeys.product(variables.productId),
      })
      await queryClient.invalidateQueries({
        queryKey: productMediaKeys.list(),
      })
    },
  })
}
