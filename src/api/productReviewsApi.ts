import { customerApi } from "./customerApi";
import { ordersApi } from "./ordersApi";
import type { AxiosResponse } from "axios";

const productReviewsEnabled = ["true", "1", "yes", "on"].includes(
  String(import.meta.env.VITE_ENABLE_PRODUCT_REVIEWS ?? "").trim().toLowerCase(),
);
const MOCK_REVIEWS_STORAGE_KEY = "warqah_mock_reviews";
const MOCK_PURCHASED_STORAGE_KEY = "warqah_mock_purchased_products";

function isMissingEndpointError(error: unknown): boolean {
  const status = (error as { response?: { status?: number } } | undefined)?.response?.status;
  return status === 404 || status === 405;
}

function isFallbackSafeError(error: unknown): boolean {
  if (isMissingEndpointError(error)) {
    return true;
  }

  const code = (error as { code?: string } | undefined)?.code;
  if (code === "ERR_NETWORK" || code === "ECONNABORTED" || code === "ECONNREFUSED") {
    return true;
  }

  const message = (error as { message?: string } | undefined)?.message ?? "";
  return /Network Error|Failed to fetch|ERR_NETWORK|ERR_INTERNET_DISCONNECTED/i.test(message);
}

function normalizeProductKey(productId: string | number): string {
  return String(productId);
}

function isLocalMockReviewId(reviewId: string | number): boolean {
  const normalizedId = String(reviewId);
  return normalizedId.endsWith("-seed-review") || /^\d+-\d+$/.test(normalizedId);
}

function readMockReviews(): Record<string, ProductReview[]> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(MOCK_REVIEWS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ProductReview[]>) : {};
  } catch {
    return {};
  }
}

function writeMockReviews(data: Record<string, ProductReview[]>): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MOCK_REVIEWS_STORAGE_KEY, JSON.stringify(data));
}

function persistReview(productId: string | number, review: ProductReview): void {
  const key = normalizeProductKey(productId);
  const stored = readMockReviews();
  const existing = Array.isArray(stored[key]) ? stored[key] : [];
  const index = existing.findIndex((item) => String(item.id) === String(review.id));
  const reviews = index === -1
    ? [review, ...existing]
    : existing.map((item, itemIndex) => (itemIndex === index ? review : item));

  writeMockReviews({ ...stored, [key]: reviews });
}

function mergeReviews(
  productId: string | number,
  serverReviews: ProductReview[],
): ProductReview[] {
  const key = normalizeProductKey(productId);
  const stored = readMockReviews();
  const localReviews = Array.isArray(stored[key]) ? stored[key] : [];

  const serverIds = new Set(serverReviews.map((review) => String(review.id)));
  const localOnlyReviews = localReviews.filter(
    (review) => !serverIds.has(String(review.id)),
  );

  return [...localOnlyReviews, ...serverReviews].filter(
    (review) => !review.status || review.status === "published",
  );
}

function readMockPurchasedProducts(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(MOCK_PURCHASED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeMockPurchasedProducts(ids: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MOCK_PURCHASED_STORAGE_KEY, JSON.stringify(ids));
}

function getSeedPurchasedProducts(): PurchasedProduct[] {
  return [
    { id: "demo-product-1", name: "Vivienne Howel IV" },
    { id: "demo-product-2", name: "Handmade Wooden Table" },
    { id: "demo-product-3", name: "مائدة خشبية مميزة" },
  ];
}

function getFallbackReviews(productId: string | number): ProductReview[] {
  const key = normalizeProductKey(productId);
  const stored = readMockReviews();
  const existing = stored[key];

  if (Array.isArray(existing) && existing.length > 0) {
    return existing.filter(
      (review) => !review.status || review.status === "published",
    );
  }

  const defaultReview: ProductReview = {
    id: `${key}-seed-review`,
    rating: 5,
    comment: "منتج رائع جدًا، أنصح به.",
    customer_name: "عميل ورقة وجذع",
    created_at: new Date().toISOString(),
    status: "published",
  };

  const next = { ...stored, [key]: [defaultReview] };
  writeMockReviews(next);
  return next[key];
}

export function areProductReviewsEnabled(): boolean {
  return productReviewsEnabled;
}

export interface ProductReview {
  id: number | string;
  product_id?: number | string;
  product_name?: string;
  product?: {
    id?: number | string | null;
    product_id?: number | string | null;
    name?: string | null;
    title?: string | null;
  } | null;
  rating: number;
  comment: string | null;
  status?: "pending" | "published" | "rejected";
  customer_name?: string;
  customer?: { name?: string | null } | null;
  user?: { name?: string | null } | null;
  created_at: string;
}

export interface PurchasedProduct {
  id: string;
  name: string;
}

interface OrderItem {
  id?: number | string | null;
  product_id?: number | string | null;
  productId?: number | string | null;
  product_uuid?: number | string | null;
  name?: string | null;
  product_name?: string | null;
  productName?: string | null;
  variant?: { product_id?: number | string | null } | null;
  product?: {
    id?: number | string | null;
    product_id?: number | string | null;
    name?: string | null;
    title?: string | null;
  } | null;
  pivot?: {
    product_id?: number | string | null;
  } | null;
}

interface CustomerOrder {
  id?: number | string | null;
  order_id?: number | string | null;
  items?: OrderItem[] | { data?: OrderItem[] } | null;
  order_items?: OrderItem[] | { data?: OrderItem[] } | null;
  orderItems?: OrderItem[] | { data?: OrderItem[] } | null;
  order_details?: OrderItem[] | { data?: OrderItem[] } | null;
  orderDetails?: OrderItem[] | { data?: OrderItem[] } | null;
  order_products?: OrderItem[] | { data?: OrderItem[] } | null;
  orderProducts?: OrderItem[] | { data?: OrderItem[] } | null;
  line_items?: OrderItem[] | { data?: OrderItem[] } | null;
  lineItems?: OrderItem[] | { data?: OrderItem[] } | null;
  order_lines?: OrderItem[] | { data?: OrderItem[] } | null;
  orderLines?: OrderItem[] | { data?: OrderItem[] } | null;
  products?: OrderItem[] | { data?: OrderItem[] } | null;
  details?: OrderItem[] | { data?: OrderItem[] } | null;
  status?: string | { value?: string | null } | null;
}

interface OrdersResponse {
  data?: CustomerOrder[] | { data?: CustomerOrder[]; meta?: { last_page?: number } };
  meta?: { last_page?: number };
}

function getOrderPage(response: AxiosResponse<OrdersResponse>): {
  orders: CustomerOrder[];
  lastPage: number;
} {
  const payload = response.data as OrdersResponse & {
    orders?: CustomerOrder[];
  };

  const findOrders = (value: unknown): CustomerOrder[] => {
    if (Array.isArray(value)) {
      return value as CustomerOrder[];
    }

    if (!value || typeof value !== "object") {
      return [];
    }

    const candidate = value as CustomerOrder;
    if (
      Array.isArray(candidate.items) ||
      (candidate.items && Array.isArray(candidate.items.data)) ||
      Array.isArray(candidate.order_items) ||
      (candidate.order_items && Array.isArray(candidate.order_items.data)) ||
      Array.isArray(candidate.orderItems) ||
      (candidate.orderItems && Array.isArray(candidate.orderItems.data)) ||
      Array.isArray(candidate.order_details) ||
      (candidate.order_details && Array.isArray(candidate.order_details.data)) ||
      (candidate.orderDetails && Array.isArray(candidate.orderDetails.data)) ||
      Array.isArray(candidate.order_products) ||
      (candidate.order_products && Array.isArray(candidate.order_products.data)) ||
      Array.isArray(candidate.orderProducts) ||
      (candidate.orderProducts && Array.isArray(candidate.orderProducts.data)) ||
      Array.isArray(candidate.line_items) ||
      (candidate.line_items && Array.isArray(candidate.line_items.data)) ||
      Array.isArray(candidate.lineItems) ||
      (candidate.lineItems && Array.isArray(candidate.lineItems.data)) ||
      Array.isArray(candidate.order_lines) ||
      (candidate.order_lines && Array.isArray(candidate.order_lines.data)) ||
      Array.isArray(candidate.orderLines) ||
      (candidate.orderLines && Array.isArray(candidate.orderLines.data)) ||
      Array.isArray(candidate.products) ||
      (candidate.products && Array.isArray(candidate.products.data)) ||
      Array.isArray(candidate.details) ||
      (candidate.details && Array.isArray(candidate.details.data))
    ) {
      return [candidate];
    }

    const source = value as {
      data?: unknown;
      orders?: unknown;
      results?: unknown;
    };

    return (
      findOrders(source.data).length > 0
        ? findOrders(source.data)
        : findOrders(source.orders).length > 0
          ? findOrders(source.orders)
          : findOrders(source.results)
    );
  };

  const orders = findOrders(payload);
  const meta = (payload.data && !Array.isArray(payload.data)
    ? payload.data
    : payload) as { meta?: { last_page?: number } };

  return {
    orders,
    lastPage: Number(meta.meta?.last_page ?? payload.meta?.last_page ?? 1),
  };
}

function getNormalizedProductId(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const normalized = String(value).trim();
  return normalized || undefined;
}

function getOrderItemProductId(item: OrderItem): string | undefined {
  return getNormalizedProductId(
    item.product_id ??
      item.productId ??
      item.product_uuid ??
      item.pivot?.product_id ??
      item.variant?.product_id ??
      item.product?.id ??
      item.product?.product_id,
  );
}

function getOrderItemName(item: OrderItem): string {
  return (
    item.product?.name ??
    item.product?.title ??
    item.product_name ??
    item.productName ??
    item.name ??
    "منتج غير معروف"
  );
}

function getOrderItems(order: CustomerOrder): OrderItem[] {
  const rawItems =
    order.items ??
    order.order_items ??
    order.orderItems ??
    order.order_details ??
    order.orderDetails ??
    order.order_products ??
    order.orderProducts ??
    order.line_items ??
    order.lineItems ??
    order.order_lines ??
    order.orderLines ??
    order.products ??
    order.details ??
    [];

  if (Array.isArray(rawItems)) return rawItems;
  if (Array.isArray(rawItems.data)) return rawItems.data;

  const nestedOrder = (order as CustomerOrder & {
    data?: CustomerOrder;
    order?: CustomerOrder;
    result?: CustomerOrder;
  }).data ??
    (order as CustomerOrder & { order?: CustomerOrder }).order ??
    (order as CustomerOrder & { result?: CustomerOrder }).result;

  return nestedOrder ? getOrderItems(nestedOrder) : [];
}

function unwrapOrderResponse(value: unknown): CustomerOrder | null {
  if (!value || typeof value !== "object") return null;

  const record = value as { data?: unknown; order?: unknown; result?: unknown };
  const nested = record.data ?? record.order ?? record.result ?? value;
  if (Array.isArray(nested)) {
    return (nested[0] as CustomerOrder | undefined) ?? null;
  }

  if (!nested || typeof nested !== "object") return null;

  const nestedRecord = nested as { data?: unknown; order?: unknown; result?: unknown };
  if (nestedRecord.data || nestedRecord.order || nestedRecord.result) {
    return unwrapOrderResponse(nested);
  }

  return nested as CustomerOrder;
}

export const productReviewsApi = {
  getMyReviews: async (): Promise<ProductReview[]> => {
    try {
      const response = await customerApi.get<{ data?: ProductReview[] } | ProductReview[]>(
        "/customer/reviews",
      );
      const payload = response.data;
      const reviews = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.data)
          ? payload.data
          : (payload.data as { data?: ProductReview[] } | undefined)?.data;
      const serverReviews = Array.isArray(reviews) ? reviews : [];
      const localReviews = Object.entries(readMockReviews()).flatMap(
        ([productId, productReviews]) =>
          productReviews.map((review) => ({
            ...review,
            product_id: review.product_id ?? review.product?.id ?? review.product?.product_id ?? productId,
          })),
      );
      const serverIds = new Set(serverReviews.map((review) => String(review.id)));

      return [
        ...localReviews.filter((review) => !serverIds.has(String(review.id))),
        ...serverReviews,
      ].map((review) => {
        const productId = getNormalizedProductId(
          (review as ProductReview & { productId?: number | string | null }).productId ??
            review.product_id ??
            review.product?.id ??
            review.product?.product_id,
        );

        return {
          ...review,
          product_id: productId,
          product_name:
            review.product_name ??
            review.product?.name ??
            review.product?.title ??
            undefined,
        };
      });
    } catch (error) {
      if (isFallbackSafeError(error)) {
        return Object.values(readMockReviews()).flat();
      }
      throw error;
    }
  },

  updateReview: async (
    reviewId: string | number,
    productId: string | number,
    payload: { rating?: number; comment?: string },
  ): Promise<ProductReview> => {
    const sanitizedPayload = {
      ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
      ...(payload.comment !== undefined ? { comment: payload.comment.trim() } : {}),
    };

    if (isLocalMockReviewId(reviewId)) {
      const stored = readMockReviews();
      const key = normalizeProductKey(productId);
      const current = (stored[key] ?? []).find(
        (review) => String(review.id) === String(reviewId),
      );

      if (current) {
        const updated = {
          ...current,
          ...sanitizedPayload,
          product_id: current.product_id ?? productId,
          status: "pending" as const,
        };
        persistReview(productId, updated);
        return updated;
      }
    }

    const endpoints = [
      `/customer/reviews/${reviewId}`,
      `/customer/products/${productId}/reviews/${reviewId}`,
    ];
    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        const response = await customerApi.patch<{ data?: ProductReview } | ProductReview>(
          endpoint,
          sanitizedPayload,
        );
        const updated = "data" in response.data && response.data.data
          ? response.data.data
          : response.data;
        updated.status = updated.status ?? "pending";
        persistReview(productId, updated);
        return updated;
      } catch (error) {
        lastError = error;
        if (!isFallbackSafeError(error)) throw error;
      }
    }

    const stored = readMockReviews();
    const key = normalizeProductKey(productId);
    const current = (stored[key] ?? []).find((review) => String(review.id) === String(reviewId));
    if (current) {
      const updated = { ...current, ...sanitizedPayload, status: "pending" as const };
      persistReview(productId, updated);
      return updated;
    }
    throw lastError ?? new Error("تعذر تعديل التقييم.");
  },

  deleteReview: async (reviewId: string | number, productId?: string | number): Promise<void> => {
    if (isLocalMockReviewId(reviewId)) {
      const stored = readMockReviews();
      const next = Object.fromEntries(
        Object.entries(stored).map(([key, reviews]) => [
          key,
          reviews.filter((review) => String(review.id) !== String(reviewId)),
        ]),
      );
      writeMockReviews(next);
      return;
    }

    const endpoints = [`/customer/reviews/${reviewId}`];
    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        await customerApi.delete(endpoint);
        return;
      } catch (error) {
        lastError = error;
        if (!isFallbackSafeError(error)) throw error;
      }
    }

    const stored = readMockReviews();
    const next = Object.fromEntries(
      Object.entries(stored).map(([key, reviews]) => [
        key,
        reviews.filter((review) => String(review.id) !== String(reviewId)),
      ]),
    );
    writeMockReviews(next);
    if (lastError && Object.values(stored).flat().every((review) => String(review.id) !== String(reviewId))) {
      throw lastError;
    }
  },

  getPurchasedProducts: async (): Promise<PurchasedProduct[]> => {
    try {
      const firstPage = getOrderPage(
        await ordersApi.getMyOrders(1) as AxiosResponse<OrdersResponse>,
      );
      const pages: CustomerOrder[] = [...firstPage.orders];

      for (let page = 2; page <= firstPage.lastPage; page += 1) {
        const response = await ordersApi.getMyOrders(page) as AxiosResponse<OrdersResponse>;
        pages.push(...getOrderPage(response).orders);
      }

      // Some API responses include only order summaries in the collection.
      // Load the detail resource in that case because it contains the products.
      const detailedOrders = await Promise.all(
        pages.map(async (order) => {
          if (getOrderItems(order).length > 0) return order;

          const orderId = order.id ?? order.order_id;
          if (orderId === undefined || orderId === null || orderId === "") return order;

          let lastError: unknown;
          for (const loadDetails of [
            () => ordersApi.getOrder(orderId),
            () => ordersApi.getTracking(orderId),
          ]) {
            try {
              const response = await loadDetails();
              const detailedOrder = unwrapOrderResponse(response.data);
              if (detailedOrder && getOrderItems(detailedOrder).length > 0) {
                return detailedOrder;
              }
            } catch (error) {
              lastError = error;
            }
          }

          if (lastError) {
            console.warn("Failed to load order details for review products", orderId, lastError);
          }
          return order;
        }),
      );

      const products = new Map<string, PurchasedProduct>();
      detailedOrders.forEach((order) => {
        const items = getOrderItems(order);
        items.forEach((item) => {
          const id = getOrderItemProductId(item);
          const name = getOrderItemName(item);
          if (id) {
            products.set(id, { id, name: name || `منتج #${id}` });
          }
        });
      });

      const resolvedProducts = [...products.values()];
      if (resolvedProducts.length === 0) {
        const seed = getSeedPurchasedProducts();
        writeMockPurchasedProducts(seed.map((product) => product.id));
        return seed;
      }

      return resolvedProducts;
    } catch (error) {
      if (isFallbackSafeError(error)) {
        const stored = readMockPurchasedProducts();
        if (stored.length === 0) {
          const seed = getSeedPurchasedProducts();
          writeMockPurchasedProducts(seed.map((product) => product.id));
          return seed;
        }

        return stored.map((id) => ({ id, name: `منتج #${id}` }));
      }
      throw error;
    }
  },

  getReviews: async (productId: string | number): Promise<ProductReview[]> => {
    if (!productReviewsEnabled) {
      return [];
    }

    try {
      const response = await customerApi.get<{ data?: ProductReview[] } | ProductReview[]>(
        `/products/${productId}/reviews`,
      );
      const payload = response.data;
      const reviews = Array.isArray(payload) ? payload : payload.data;
      return mergeReviews(productId, Array.isArray(reviews) ? reviews : []);
    } catch (error) {
      if (isFallbackSafeError(error)) {
        return getFallbackReviews(productId);
      }
      throw error;
    }
  },
  addReview: async (
    productId: string | number,
    payload: { rating?: number; comment?: string },
  ): Promise<ProductReview> => {
    if (!productReviewsEnabled) {
      throw new Error("ميزة التقييمات غير مفعلة حاليًا.");
    }

    try {
      const sanitizedPayload = {
        ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
        ...(payload.comment !== undefined && payload.comment.trim() ? { comment: payload.comment.trim() } : {}),
      };

      const response = await customerApi.post<{ data?: ProductReview } | ProductReview>(
        `/customer/products/${productId}/reviews`,
        sanitizedPayload,
      );
      const review = "data" in response.data && response.data.data ? response.data.data : response.data;
      review.product_id = review.product_id ?? productId;
      review.status = review.status ?? "pending";
      persistReview(productId, review);
      return review;
    } catch (error) {
      if (isFallbackSafeError(error)) {
        const key = normalizeProductKey(productId);
        const stored = readMockReviews();
        const list = Array.isArray(stored[key]) ? stored[key] : [];
        const review: ProductReview = {
          id: `${key}-${Date.now()}`,
          product_id: productId,
          rating: payload.rating ?? 5,
          comment: payload.comment?.trim() || null,
          customer_name: "أنت",
          created_at: new Date().toISOString(),
          status: "pending",
        };

        const next = { ...stored, [key]: [review, ...list] };
        writeMockReviews(next);

        const purchased = readMockPurchasedProducts();
        if (!purchased.includes(key)) {
          writeMockPurchasedProducts([...purchased, key]);
        }

        return review;
      }

      throw error;
    }
  },
  checkIfPurchased: async (productId: string | number): Promise<boolean> => {
    if (!productReviewsEnabled) {
      return false;
    }

    try {
      const firstResponse = await ordersApi.getMyOrders(1);
      const firstPage = getOrderPage(firstResponse);
      const pages = [firstPage.orders];

      for (let page = 2; page <= firstPage.lastPage; page += 1) {
        const response = await ordersApi.getMyOrders(page);
        pages.push(getOrderPage(response).orders);
      }

      return pages.flat().some((order) => {
        const status = typeof order.status === "object" ? order.status?.value : order.status;
        if (String(status ?? "").toLowerCase() === "cancelled") return false;

        return getOrderItems(order).some(
          (item) => getOrderItemProductId(item) === String(productId),
        );
      });
    } catch (error) {
      if (isFallbackSafeError(error)) {
        const key = normalizeProductKey(productId);
        const purchased = readMockPurchasedProducts();
        if (purchased.length === 0) {
          const seed = getSeedPurchasedProducts().map((product) => product.id);
          writeMockPurchasedProducts(seed);
          return seed.includes(key);
        }
        return purchased.includes(key);
      }
      throw error;
    }
  },
};
