import { customerApi } from "@/api/customerApi";

export const WISHLIST_IDS_STORAGE_KEY = "wishlist_ids";

export function getStoredWishlistIds(): string[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(WISHLIST_IDS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function setStoredWishlistIds(ids: Iterable<string | number>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_IDS_STORAGE_KEY, JSON.stringify([...new Set([...ids].map(String))]));
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  imageAlt: string;
  category: string;
  tag: string;
}

interface FavoriteApiMedia {
  url?: string | null;
  is_primary?: boolean | null;
}

interface FavoriteApiProduct {
  id?: string | number | null;
  name?: string | null;
  price?: string | number | null;
  category?: {
    name?: string | null;
  } | null;
  media?: FavoriteApiMedia[] | null;
  is_new?: boolean | null;
  is_bestseller?: boolean | null;
  is_limited_edition?: boolean | null;
}

interface FavoriteApiItem {
  id?: string | number | null;
  product_id?: string | number | null;
  product?: FavoriteApiProduct | null;
}

const defaultImage = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";

function resolveImage(product: FavoriteApiProduct | null | undefined): string {
  const media = Array.isArray(product?.media) ? product.media : [];
  const primaryMedia = media.find((item) => item.is_primary) ?? media[0];
  return primaryMedia?.url || defaultImage;
}

function resolveTag(product: FavoriteApiProduct | null | undefined): string {
  if (product?.is_bestseller) return "الأكثر طلباً";
  if (product?.is_new) return "جديد";
  if (product?.is_limited_edition) return "حصري";
  return "مميز";
}

function mapFavoriteToWishlistItem(favorite: FavoriteApiItem): WishlistItem {
  const product = favorite.product ?? {};
  const productId = String(product.id ?? favorite.product_id ?? favorite.id ?? "");

  return {
    id: String(favorite.id ?? productId),
    productId,
    name: product.name ?? "منتج",
    price: Number(product.price ?? 0),
    image: resolveImage(product),
    imageAlt: product.name ?? "منتج",
    category: product.category?.name ?? "منتجات",
    tag: resolveTag(product),
  };
}

export const favoritesApi = {
  getFavorites: async (): Promise<WishlistItem[]> => {
    const { data } = await customerApi.get("/customer/favorites");
    const items = Array.isArray(data) ? data : data?.data ?? [];

    return items.map((favorite: FavoriteApiItem) => mapFavoriteToWishlistItem(favorite));
  },

  toggleFavorite: async (productId: string | number): Promise<boolean> => {
    const { data } = await customerApi.post(`/customer/favorites/${productId}`);
    const payload = data?.data ?? data;
    const favorite = payload?.favorite ?? payload?.is_favorited ?? payload?.isFavorite;

    if (typeof favorite === "boolean") return favorite;
    if (typeof favorite === "string") return favorite === "true" || favorite === "1";
    return favorite === 1;
  },
};
