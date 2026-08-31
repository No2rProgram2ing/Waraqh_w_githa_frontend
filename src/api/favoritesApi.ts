import { customerApi } from "@/api/customerApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";

export const WISHLIST_IDS_STORAGE_KEY = "wishlist_ids";
export const GUEST_WISHLIST_STORAGE_KEY = "guest_wishlist";

function storageKeyForWishlist(): string {
  const user = customerAuthStorage.getUser<{ id?: string }>();
  const userId = user?.id ? String(user.id) : "guest";
  return userId === "guest" ? GUEST_WISHLIST_STORAGE_KEY : `${WISHLIST_IDS_STORAGE_KEY}:${userId}`;
}

export function getStoredWishlistIds(): string[] {
  if (typeof window === "undefined") return [];

  const key = storageKeyForWishlist();
  const raw = localStorage.getItem(key)
    ?? (key === GUEST_WISHLIST_STORAGE_KEY
      ? localStorage.getItem(`${WISHLIST_IDS_STORAGE_KEY}:guest`) ?? localStorage.getItem(WISHLIST_IDS_STORAGE_KEY)
      : null);
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
  const key = storageKeyForWishlist();
  localStorage.setItem(key, JSON.stringify([...new Set([...ids].map(String))]));
}

export function clearGuestWishlist(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
  localStorage.removeItem(`${WISHLIST_IDS_STORAGE_KEY}:guest`);
  localStorage.removeItem(WISHLIST_IDS_STORAGE_KEY);
}

export async function migrateGuestWishlist(): Promise<void> {
  if (typeof window === "undefined" || !customerAuthStorage.getToken()) return;

  const guestKey = GUEST_WISHLIST_STORAGE_KEY;
  const raw = localStorage.getItem(guestKey)
    ?? localStorage.getItem(`${WISHLIST_IDS_STORAGE_KEY}:guest`)
    ?? localStorage.getItem(WISHLIST_IDS_STORAGE_KEY);
  if (!raw) return;

  let guestIds: string[];
  try {
    const parsed: unknown = JSON.parse(raw);
    guestIds = Array.isArray(parsed) ? [...new Set(parsed.map(String))] : [];
  } catch (error) {
    console.error("Failed to read guest wishlist", error);
    return;
  }

  if (guestIds.length === 0) {
    clearGuestWishlist();
    return;
  }

  const existing = await favoritesApi.getFavorites();
  const existingIds = new Set(existing.map((item) => item.productId));
  const failedIds: string[] = [];

  for (const productId of guestIds) {
    if (existingIds.has(productId)) continue;
    try {
      const added = await favoritesApi.toggleFavorite(productId);
      if (added) existingIds.add(productId);
      else failedIds.push(productId);
    } catch (error) {
      console.error(`Failed to migrate favorite product ${productId}`, error);
      failedIds.push(productId);
    }
  }

  if (failedIds.length > 0) {
    localStorage.setItem(guestKey, JSON.stringify(failedIds));
  } else {
    clearGuestWishlist();
  }

  setStoredWishlistIds([...existingIds]);
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

/**
 * Toggles a favorite without ever sending a guest request to the customer API.
 * The caller supplies the current auth state so this helper remains independent
 * from the auth store and can be reused by non-hook components.
 */
export async function toggleWishlist(
  productId: string | number,
  isAuthenticated: boolean,
): Promise<boolean> {
  const normalizedId = String(productId);
  if (isAuthenticated) {
    return favoritesApi.toggleFavorite(normalizedId);
  }

  const storedIds = getStoredWishlistIds();
  const isFavorite = storedIds.includes(normalizedId);
  setStoredWishlistIds(
    isFavorite
      ? storedIds.filter((id) => id !== normalizedId)
      : [...storedIds, normalizedId],
  );
  return !isFavorite;
}
