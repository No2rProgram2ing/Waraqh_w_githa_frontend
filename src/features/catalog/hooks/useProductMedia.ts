    import {
    useMutation,
    useQuery,
    useQueryClient,
    } from '@tanstack/react-query'

    import {
    productMediaApi,
    type CreateProductMediaPayload,
    type UpdateProductMediaPayload,
    } from '../api/productMediaApi'

    export const productMediaKeys = {
    all: ['admin', 'product-media'] as const,

    list: () => [...productMediaKeys.all, 'list'] as const,

    product: (productId: number) =>
        [...productMediaKeys.all, 'product', productId] as const,
    }

    export function useProductMedia(productId?: number) {
    return useQuery({
        queryKey: productMediaKeys.product(productId ?? 0),

        queryFn: async () => {
        const response = await productMediaApi.getAll()

        return response.data.filter(
            (media) => media.product_id === productId,
        )
        },

        enabled:
        Number.isInteger(productId) &&
        Number(productId) > 0,
    })
    }

    export function useCreateProductMedia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (
        data: CreateProductMediaPayload,
        ) => productMediaApi.create(data),

        onSuccess: async (media) => {
        await queryClient.invalidateQueries({
            queryKey: productMediaKeys.product(
            media.product_id,
            ),
        })

        await queryClient.invalidateQueries({
            queryKey: productMediaKeys.list(),
        })

        await queryClient.invalidateQueries({
            queryKey: ['admin', 'product', media.product_id],
        })
        },
    })
    }

    export function useUpdateProductMedia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
        id,
        data,
        }: {
        id: number
        data: UpdateProductMediaPayload
        }) => productMediaApi.update(id, data),

        onSuccess: async (media) => {
        await queryClient.invalidateQueries({
            queryKey: productMediaKeys.product(
            media.product_id,
            ),
        })

        await queryClient.invalidateQueries({
            queryKey: productMediaKeys.list(),
        })

        await queryClient.invalidateQueries({
            queryKey: ['admin', 'product', media.product_id],
        })
        },
    })
    }

    export function useDeleteProductMedia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) =>
        productMediaApi.delete(id),

        onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: productMediaKeys.all,
        })
        },
    })
    }

    export function useUploadProductMedia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
        productId,
        files,
        }: {
        productId: number
        files: File[]
        }) => productMediaApi.upload(productId, files),

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

    export function useReorderProductMedia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
        productId,
        orderedIds,
        }: {
        productId: number
        orderedIds: number[]
        }) => productMediaApi.reorder(productId, orderedIds),

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

    export function useSetPrimaryProductMedia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
        productId,
        mediaId,
        }: {
        productId: number
        mediaId: number
        }) => productMediaApi.setPrimary(productId, mediaId),

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