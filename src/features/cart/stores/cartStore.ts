
import { create } from "zustand";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { getProductImage } from "@/features/products/data/productImages";
import { cartApi } from "@/api/cartApi";
import { createJSONStorage, persist } from 'zustand/middleware';
import { MAX_CART_QUANTITY } from '@/features/cart/constants';

export const DEFAULT_RESERVATION_MINUTES = 5;

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  reservedQuantity?: number;
  reservedFromStock?: number;
  availableStock?: number;
  isLimitedStock: boolean;
  reservedUntil?: string | number | null;
  isReserved?: boolean;
  isBackordered?: boolean;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  reservationExpiresAt: number | null;
  isReservationExpired: boolean;
  isHydrated: boolean;

  setItems: (items: CartItem[], expiresAt?: number | null) => void;
  setReservationExpiry: (expiresAt: number | null) => void;
  addItem: (item: CartItem) => void;
  upsertItem: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateInventory: (
    itemId: string,
    reservedQuantity: number,
    availableStock: number,
    reservedFromStock?: number,
  ) => void;
  markBackordered: (itemId: string, quantity: number, availableStock: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  expireReservation: () => void;
  reserveCart: (durationMinutes?: number) => Promise<boolean>;
  renewReservation: (durationMinutes?: number) => Promise<boolean>;
  refreshCart: () => Promise<void>;
  syncGuestCart: () => Promise<void>;
}

const normalizeItem = (item: CartItem): CartItem => ({
  ...item,
  id: String(item.id),
  productId: String(item.productId ?? item.id),
  name: item.name ?? '',
  subtitle: item.subtitle ?? '',
  price: Number(item.price ?? 0),
  quantity: Math.max(1, Math.min(Number(item.quantity ?? 1), MAX_CART_QUANTITY)),
  image: item.image ?? '',
  stock: Number(item.stock ?? 0),
  reservedQuantity: Math.min(
    Number(item.quantity ?? 1),
    Math.max(0, Number(item.reservedQuantity ?? 0)),
  ),
  reservedFromStock: Math.min(
    Number(item.quantity ?? 1),
    Math.max(0, Number(item.reservedFromStock ?? item.reservedQuantity ?? 0)),
  ),
  availableStock: Number(item.availableStock ?? item.stock ?? 0),
  isLimitedStock: Boolean(item.isLimitedStock ?? (item.stock > 0 && item.stock <= 5)),
  reservedUntil: item.reservedUntil ?? null,
  isReserved: item.isReserved ?? Boolean(item.reservedUntil),
  isBackordered: Boolean(item.isBackordered),
});

const calculateItemCount = (items: CartItem[]): number =>
  items.reduce((total, item) => total + Math.max(0, Number(item.quantity ?? 0)), 0);

const getReservableStock = (item: CartItem): number =>
  Math.max(
    0,
    Number(item.availableStock ?? item.stock ?? 0) +
      Number(item.reservedQuantity ?? 0),
  );

const getReservationExpiry = (value: string | number | null | undefined): number | null => {
  if (!value) return null;
  const date = new Date(value).getTime();
  return Number.isFinite(date) ? date : null;
};

const getCartResponseItems = (response: any): any[] => {
  const items = response?.data?.items ?? response?.items;
  return Array.isArray(items) ? items : items?.data ?? [];
};

const getCartOwnerKey = (): string => {
  const user = customerAuthStorage.getUser<{ id?: string | number }>();
  const userId = user?.id;
  if (userId !== undefined && userId !== null && String(userId).trim()) {
    return `user-${String(userId)}`;
  }

  const token = customerAuthStorage.getToken();
  return token ? `token-${token}` : 'guest';
};

const userScopedCartStorage = {
  getItem: (name: string): string | null =>
    localStorage.getItem(`${name}-${getCartOwnerKey()}`),
  setItem: (name: string, value: string): void => {
    localStorage.setItem(`${name}-${getCartOwnerKey()}`, value);
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(`${name}-${getCartOwnerKey()}`);
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      reservationExpiresAt: null,
      isReservationExpired: false,
      isHydrated: false,

      setItems: (items: CartItem[], expiresAt?: number | null) => {
        const normalizedItems = items.map(normalizeItem);
        const hasActiveReservation = normalizedItems.some((item) => Boolean(item.isReserved));
        const expiry = typeof expiresAt === 'number' && hasActiveReservation ? expiresAt : null;
        const nextItems = normalizedItems.map((item) => ({
          ...item,
          isReserved: hasActiveReservation ? Boolean(item.isReserved) : false,
          reservedUntil: hasActiveReservation ? item.reservedUntil : null,
        }));

        set({
          items: nextItems,
          itemCount: calculateItemCount(nextItems),
          reservationExpiresAt: expiry,
          isReservationExpired: Boolean(expiry && expiry <= Date.now()),
        });
      },

      setReservationExpiry: (expiresAt: number | null) => {
        set((state) => {
          const nextItems = state.items.map((item) => ({
            ...item,
            reservedUntil:
              expiresAt && item.isReserved && (item.reservedQuantity ?? 0) > 0
                ? new Date(expiresAt).toISOString()
                : null,
            isReserved:
              Boolean(expiresAt && expiresAt > Date.now()) &&
              item.isReserved &&
              (item.reservedQuantity ?? 0) > 0,
          }));

          return {
            reservationExpiresAt: expiresAt,
            isReservationExpired: Boolean(expiresAt && expiresAt <= Date.now()),
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });
      },

      addItem: (incomingItem: CartItem) => {
        const item = normalizeItem(incomingItem);

        set((state) => {
          const existingIndex = state.items.findIndex(
            (entry) => entry.productId === item.productId || entry.id === item.id,
          );

          const nextItems =
            existingIndex === -1
              ? [...state.items, item]
              : state.items.map((entry, index) => {
                  if (index !== existingIndex) return entry;

                  const nextQuantity = Math.min(
                    MAX_CART_QUANTITY,
                    Number(entry.quantity ?? 0) + Number(item.quantity ?? 1),
                  );

                  const diff = nextQuantity - Number(entry.quantity ?? 0);
                  const nextStock = entry.isReserved
                    ? Math.max(0, Number(entry.stock ?? 0) - diff)
                    : Number(entry.stock ?? 0);

                  return {
                    ...entry,
                    ...item,
                    id: entry.id || item.id,
                    productId: entry.productId || item.productId,
                    quantity: nextQuantity,
                    stock: nextStock,
                  };
                });

          return {
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });

        const expiry = get().reservationExpiresAt;
        if (!expiry || expiry <= Date.now()) {
          void get().reserveCart(DEFAULT_RESERVATION_MINUTES);
        }
      },

      upsertItem: (incomingItem: CartItem) => {
        const item = normalizeItem(incomingItem);

        set((state) => {
          const existingIndex = state.items.findIndex(
            (entry) => entry.productId === item.productId || entry.id === item.id,
          );

          if (existingIndex === -1) {
            const nextItems = [...state.items, item];
            return {
              items: nextItems,
              itemCount: calculateItemCount(nextItems),
            };
          }

          const nextItems = state.items.map((entry, index) =>
            index === existingIndex
              ? { ...entry, ...item, id: entry.id, productId: entry.productId }
              : entry,
          );

          return {
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });

        const expiry = get().reservationExpiresAt;
        if (!expiry || expiry <= Date.now()) {
          void get().reserveCart(DEFAULT_RESERVATION_MINUTES);
        }
      },

      updateQuantity: (itemId: string, quantity: number) => {
        const nextQuantity = Math.min(MAX_CART_QUANTITY, Math.max(1, Number(quantity ?? 1)));

        let hasExpiredReservation = false;

        set((state) => {
          hasExpiredReservation = Boolean(
            state.reservationExpiresAt && state.reservationExpiresAt <= Date.now(),
          );

          const nextItems = state.items.map((item) => {
            if (item.id !== itemId && item.productId !== itemId) return item;

            const availableStock = Math.max(
              0,
              Number(item.availableStock ?? item.stock ?? 0),
            );
            const currentReservedQuantity = Math.max(
              0,
              Number(item.reservedQuantity ?? item.reservedFromStock ?? 0),
            );
            const stockCapacity = availableStock + currentReservedQuantity;
            const reservedQuantity = Math.min(nextQuantity, stockCapacity);
            const remainingStock = Math.max(0, stockCapacity - reservedQuantity);

            return {
              ...item,
              quantity: nextQuantity,
              stock: remainingStock,
              availableStock: remainingStock,
              reservedQuantity,
              reservedFromStock: reservedQuantity,
              isReserved: reservedQuantity > 0,
            };
          });

          return {
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });

        if (hasExpiredReservation) {
          void get().reserveCart(DEFAULT_RESERVATION_MINUTES);
        }
      },

      updateInventory: (
        itemId: string,
        reservedQuantity: number,
        availableStock: number,
        reservedFromStock = 0,
      ) => {
        set((state) => {
          const nextItems = state.items.map((item) =>
            item.id === itemId || item.productId === itemId
              ? (() => {
                   const stockCapacity = Math.max(
                     0,
                     Number(item.availableStock ?? item.stock ?? 0) +
                       Number(item.reservedQuantity ?? 0),
                   );
                   const nextReservedQuantity = Math.min(
                     item.quantity,
                     stockCapacity,
                     Math.max(0, Number(reservedQuantity)),
                   );
                   const nextReservedFromStock = Math.min(
                     item.quantity,
                     stockCapacity,
                     Math.max(0, Number(reservedFromStock)),
                   );

                   return {
                     ...item,
                     reservedQuantity: nextReservedQuantity,
                     reservedFromStock: nextReservedFromStock,
                     availableStock: Math.max(0, Number(availableStock)),
                     stock: Math.max(0, Number(availableStock)),
                     isReserved: nextReservedQuantity > 0,
                     reservedUntil:
                       nextReservedQuantity > 0 && state.reservationExpiresAt
                         ? new Date(state.reservationExpiresAt).toISOString()
                         : null,
                   };
                })()
              : item,
          );

          return {
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });
      },

      markBackordered: (itemId: string, quantity: number, availableStock: number) => {
        set((state) => {
          const nextItems = state.items.map((item) =>
            item.id === itemId || item.productId === itemId
              ? {
                  ...item,
                  quantity: Math.max(item.quantity, quantity),
                  reservedQuantity: Math.min(
                    Math.max(0, Number(item.reservedQuantity ?? 0)),
                    quantity,
                  ),
                  availableStock: Math.max(0, availableStock),
                  stock: Math.max(0, availableStock),
                  isReserved: true,
                  isBackordered: true,
                }
              : item,
          );

          return {
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => {
          const nextItems = state.items.filter((item) => item.id !== itemId && item.productId !== itemId);
          return {
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          reservationExpiresAt: null,
          isReservationExpired: false,
        });
      },

      expireReservation: () => {
        set((state) => {
          const nextItems = state.items.map((item) => {
            if (!item.isReserved || (item.reservedQuantity ?? 0) <= 0) return item;

            const releasedQuantity = Math.min(
              Number(item.quantity ?? 0),
              Math.max(
                0,
                Number(item.reservedFromStock ?? item.reservedQuantity ?? 0),
              ),
            );

            return {
              ...item,
              reservedQuantity: 0,
              reservedFromStock: 0,
              reservedUntil: null,
              isReserved: false,
              stock: Number(item.stock ?? 0) + releasedQuantity,
              availableStock:
                Number(item.availableStock ?? item.stock ?? 0) + releasedQuantity,
            };
          });

          return {
            reservationExpiresAt: null,
            isReservationExpired: true,
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });
      },

      reserveCart: async (durationMinutes = DEFAULT_RESERVATION_MINUTES) => {
        const minutes = Math.max(1, Number(durationMinutes ?? DEFAULT_RESERVATION_MINUTES));
        const expiry = Date.now() + minutes * 60 * 1000;

        try {
          if (customerAuthStorage.getToken()) {
            const response = await cartApi.reserve(minutes);
            const serverExpiry = getReservationExpiry(
              response?.data?.expires_at ?? response?.expires_at ?? response?.data?.reserved_until ?? response?.reserved_until,
            );

            const reservableItems = get().items.map((item) => {
              const baseStock = Math.max(0, Number(item.availableStock ?? item.stock ?? 0));
              const reservedQuantity = Math.max(0, Number(item.quantity ?? 0));
              const remainingStock = Math.max(0, baseStock - reservedQuantity);
              return {
                ...item,
                reservedQuantity,
                reservedFromStock: reservedQuantity,
                availableStock: remainingStock,
                stock: remainingStock,
                isReserved: reservedQuantity > 0,
                reservedUntil:
                  reservedQuantity > 0
                    ? new Date(serverExpiry ?? expiry).toISOString()
                    : null,
              };
            });
            const hasActiveReservation = reservableItems.some((item) => item.isReserved);
            set({
              items: reservableItems,
              itemCount: calculateItemCount(reservableItems),
              reservationExpiresAt: hasActiveReservation ? serverExpiry ?? expiry : null,
              isReservationExpired: false,
            });
            await get().refreshCart();
            return Boolean(serverExpiry || hasActiveReservation);
          }

          const hasAnyItem = get().items.length > 0;
          set((state) => {
            const nextItems = state.items.map((item) => {
              const baseStock = Math.max(0, Number(item.availableStock ?? item.stock ?? 0));
              const reservedQuantity = Math.max(0, Number(item.quantity ?? 0));
              const remainingStock = Math.max(0, baseStock - reservedQuantity);
              return {
                ...item,
                reservedQuantity,
                reservedFromStock: reservedQuantity,
                availableStock: remainingStock,
                stock: remainingStock,
                isReserved: reservedQuantity > 0,
                reservedUntil:
                  reservedQuantity > 0 ? new Date(expiry).toISOString() : null,
              };
            });
            return {
              items: nextItems,
              itemCount: calculateItemCount(nextItems),
              reservationExpiresAt: hasAnyItem ? expiry : null,
              isReservationExpired: false,
            };
          });
          return hasAnyItem;
        } catch (error) {
          console.error('Failed to reserve cart', error);
          set({
            reservationExpiresAt: null,
            isReservationExpired: true,
          });
          return false;
        }
      },

      renewReservation: async (durationMinutes = DEFAULT_RESERVATION_MINUTES) => {
        const minutes = Math.max(1, Number(durationMinutes ?? DEFAULT_RESERVATION_MINUTES));
        const expiry = Date.now() + minutes * 60 * 1000;

        try {
          if (!get().items.length) return false;

          if (customerAuthStorage.getToken()) {
            const response = await cartApi.renewReservation(minutes);
            const serverExpiry = getReservationExpiry(
              response?.data?.expires_at ?? response?.expires_at ?? response?.data?.reserved_until ?? response?.reserved_until,
            );
            const nextExpiry = serverExpiry ?? expiry;
            await get().refreshCart();
            const hasActiveReservation = get().items.some((item) => item.isReserved);
            set({
              reservationExpiresAt: hasActiveReservation ? nextExpiry : null,
              isReservationExpired: !hasActiveReservation,
            });
            return hasActiveReservation;
          }

          const hasActiveReservation = get().items.some(
            (item) => Number(item.reservedQuantity ?? 0) > 0,
          );
          set((state) => ({
            reservationExpiresAt: hasActiveReservation ? expiry : null,
            isReservationExpired: !hasActiveReservation,
            items: state.items.map((item) => ({
              ...item,
              reservedUntil: hasActiveReservation ? new Date(expiry).toISOString() : null,
              isReserved: hasActiveReservation && Number(item.reservedQuantity ?? 0) > 0,
            })),
          }));
          return hasActiveReservation;
        } catch (error) {
          console.error('Failed to renew cart reservation', error);
          return false;
        }
      },

      refreshCart: async () => {
        if (!customerAuthStorage.getToken()) return;

        const response = await cartApi.getCart();
        const serverItems = getCartResponseItems(response);
        if (!serverItems.length) {
          set((state) => ({
            items: state.items,
            itemCount: calculateItemCount(state.items),
          }));
          return;
        }

        set((state) => {
          const nextItems = state.items.map((item) => {
            const serverItem = serverItems.find(
              (entry) =>
                String(entry.id) === item.id ||
                String(entry.product_id ?? entry.product?.id) === item.productId,
            );
            if (!serverItem) return item;

            const product = serverItem.product ?? {};
            const quantity = Math.max(1, Number(serverItem.quantity ?? item.quantity));
            const reservedQuantity = Math.min(
              quantity,
              Math.max(0, Number(serverItem.reserved_quantity ?? 0)),
            );
            const isReserved =
              Boolean(serverItem.is_reserved ?? reservedQuantity > 0) &&
              reservedQuantity > 0 &&
              !serverItem.is_expired;
            const availableStock = Math.max(
              0,
              Number(product.available_stock ?? item.availableStock ?? item.stock ?? 0),
            );

            return {
              ...item,
              quantity,
              price: Number(product.price ?? item.price),
              stock: availableStock,
              availableStock,
              reservedQuantity,
              reservedFromStock: isReserved ? reservedQuantity : 0,
              isReserved,
              reservedUntil: isReserved
                ? response?.data?.expires_at ?? response?.expires_at ?? item.reservedUntil
                : null,
            };
          });

          return {
            items: nextItems,
            itemCount: calculateItemCount(nextItems),
          };
        });
      },

      syncGuestCart: async () => {
        const token = customerAuthStorage.getToken();
        if (!token) return;

        const currentItems = get().items;
        if (!currentItems.length) {
          try {
            await cartApi.sync([]);
          } catch {
            // Ignore empty sync failures while no guest cart items exist.
          }
          return;
        }

        try {
          const payload = currentItems.map((item) => ({
            product_id: item.productId ?? item.id,
            quantity: item.quantity,
          }));

          const response = await cartApi.sync(payload);
          const serverItems = response?.data?.items ?? response?.items ?? currentItems;
          const alignedItems = Array.isArray(serverItems)
              ? serverItems.map((item: any) => ({
                id: String(item.id ?? item.product_id ?? item.product?.id ?? item.productId ?? ''),
                productId: String(item.product_id ?? item.product?.id ?? item.productId ?? ''),
                name: item.name ?? item.product?.name ?? '',
                subtitle: item.subtitle ?? item.product?.description ?? '',
                price: Number(item.price ?? item.product?.price ?? 0),
                quantity: Number(item.quantity ?? 1),
                image: item.image ?? item.product?.image ?? '',
                stock: Number(item.stock ?? item.product?.stock ?? item.product?.stock_quantity ?? 0),
                isLimitedStock: Boolean(item.isLimitedStock ?? ((Number(item.stock ?? item.product?.stock ?? item.product?.stock_quantity ?? 0) > 0) && (Number(item.stock ?? item.product?.stock ?? item.product?.stock_quantity ?? 0) <= 5))),
                reservedUntil: item.reserved_until ?? item.reservedUntil ?? null,
                isReserved: item.is_reserved ?? item.isReserved ?? Boolean(item.reserved_until ?? item.reservedUntil),
              }))
            : currentItems;

          const expiry = getReservationExpiry(
            response?.data?.expires_at ?? response?.expires_at ?? response?.data?.reserved_until ?? response?.reserved_until,
          );

          const syncedItems = alignedItems.map(normalizeItem);
          set({
            items: syncedItems,
            itemCount: calculateItemCount(syncedItems),
            reservationExpiresAt: expiry ?? get().reservationExpiresAt ?? null,
            isReservationExpired: Boolean(expiry && expiry <= Date.now()),
          });
        } catch (error) {
          console.error('Failed to sync guest cart', error);
        }
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => userScopedCartStorage),
      partialize: (state) => ({
        items: state.items,
        reservationExpiresAt: state.reservationExpiresAt,
        isReservationExpired: state.isReservationExpired,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.reservationExpiresAt) {
          state.isReservationExpired = state.reservationExpiresAt <= Date.now();
        }
        if (state) state.isHydrated = true;
      },
    },
 ),
);