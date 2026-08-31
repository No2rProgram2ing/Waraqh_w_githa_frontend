import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesApi, toggleWishlist, type WishlistItem } from "@/api/favoritesApi";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";

export const WISHLIST_QUERY_KEY = ["wishlist"];

export function useWishlist(enabled = true) {
  const queryClient = useQueryClient();
  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);

  const wishlistQuery = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => favoritesApi.getFavorites(),
    enabled,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (productId: string | number) => toggleWishlist(productId, isAuthenticated),
    onSuccess: async (isFavorite, productId) => {
      if (!isFavorite) {
        queryClient.setQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY, (current) =>
          (current ?? []).filter((item) => item.productId !== String(productId)),
        );
      }

      if (isAuthenticated) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: ["products-catalog"] }),
        ]);
      }
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
