import axios from "axios";
import { customerApi } from "@/api/customerApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { MAX_CART_QUANTITY } from "@/features/cart/constants";

export interface CartSyncItem {
  product_id: string;
  quantity: number;
}

export interface CartReservationData {
  expires_at?: string | number | null;
  reserved_until?: string | number | null;
  duration_minutes?: number;
  is_reserved?: boolean;
}

const isMissingCartEndpointError = (error: unknown) => {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  return status === 404 || status === 405 || status === 501;
};

const safeCartRequest = async <T>(request: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (isMissingCartEndpointError(error)) {
      return fallback;
    }

    throw error;
  }
};

export const cartApi = {
  getCart: async () => {
    if (!customerAuthStorage.getToken()) return { data: { items: [] } };

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.get("/customer/cart");
        return { data };
      },
      { data: { items: [] } },
    );
  },

  addToCart: async (productId: string | number, quantity = 1) => {
    if (!customerAuthStorage.getToken()) return { data: null };

    const payload = {
      product_id: productId,
      quantity: Math.min(MAX_CART_QUANTITY, Math.max(1, quantity)),
      allow_backorder: true,
    };

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.post("/customer/cart/items", payload);
        return { data };
      },
      { data: null },
    );
  },

  updateItem: async (
    cartItemId: string | number,
    quantity: number,
    resetReservation = true,
  ) => {
    if (!customerAuthStorage.getToken()) return { data: null };
    const boundedQuantity = Math.min(MAX_CART_QUANTITY, Math.max(1, quantity));

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.put(`/customer/cart/items/${cartItemId}`, {
          quantity: boundedQuantity,
          allow_backorder: true,
          reset_reservation: resetReservation,
        });
        return { data };
      },
      { data: null },
    );
  },

  rereserveItem: async (
    cartItemId: string | number,
    durationMinutes = 5,
    quantity?: number,
  ) => {
    if (!customerAuthStorage.getToken()) return { data: null };

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.post(`/customer/cart/items/${cartItemId}/rereserve`, {
          duration_minutes: durationMinutes,
          ...(quantity !== undefined ? { quantity: Math.min(MAX_CART_QUANTITY, Math.max(1, quantity)) } : {}),
        });
        return { data };
      },
      { data: null },
    );
  },

  removeItem: async (cartItemId: string | number) => {
    if (!customerAuthStorage.getToken()) return { data: null };

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.delete(`/customer/cart/items/${cartItemId}`);
        return { data };
      },
      { data: null },
    );
  },

  clearCart: async () => {
    if (!customerAuthStorage.getToken()) return { data: null };

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.delete("/customer/cart");
        return { data };
      },
      { data: null },
    );
  },

  sync: async (items: CartSyncItem[]) => {
    return safeCartRequest(
      async () => {
        const { data } = await customerApi.post("/customer/cart/sync", { items });
        return { data };
      },
      { data: { items } },
    );
  },

  reserve: async (durationMinutes = 5) => {
    if (!customerAuthStorage.getToken()) return { data: null };

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.post("/customer/cart/reserve", { duration_minutes: durationMinutes });
        return { data };
      },
      { data: null },
    );
  },

  renewReservation: async (durationMinutes = 5) => {
    if (!customerAuthStorage.getToken()) return { data: null };

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.post("/customer/cart/renew", { duration_minutes: durationMinutes });
        return { data };
      },
      { data: null },
    );
  },

  releaseReservation: async () => {
    if (!customerAuthStorage.getToken()) return { data: null };

    return safeCartRequest(
      async () => {
        const { data } = await customerApi.post("/customer/cart/release");
        return { data };
      },
      { data: null },
    );
  },
};
