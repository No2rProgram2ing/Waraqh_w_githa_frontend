import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesApi, type WishlistItem } from "@/api/favoritesApi";

export const WISHLIST_QUERY_KEY = ["wishlist"];

export function useWishlist(enabled = true) {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => favoritesApi.getFavorites(),
    enabled,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (productId: string | number) => favoritesApi.toggleFavorite(productId),
    onSuccess: async (isFavorite, productId) => {
      if (!isFavorite) {
        queryClient.setQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY, (current) =>
          (current ?? []).filter((item) => item.productId !== String(productId)),
        );
        return;
      }

      await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  return {
    items: wishlistQuery.data ?? [],
    isLoading: wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    error: wishlistQuery.error,
    refetch: wishlistQuery.refetch,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    isToggling: toggleFavoriteMutation.isPending,
  };
}
