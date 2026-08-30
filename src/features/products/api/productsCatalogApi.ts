import { customerApi } from '@/api/customerApi';
import type { PaginatedResponse, Product, ProductCategory, ProductFiltersDTO, ProductPriceRange } from '@/features/products/types';

function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
  return value === 1;
}

function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const candidates = [record.data, record.products, record.items, record.result, record.records];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return [];
}

function normalizeProductRecord(item: Record<string, unknown>): Product {
  const id = String(item.id ?? item.product_id ?? item.slug ?? '');
  const rawName = item.name ?? item.title ?? 'منتج';
  const rawSubtitle = item.subtitle ?? item.short_description ?? item.description ?? 'منتج مميز';
  const priceValue = toNumber(item.price ?? item.amount ?? item.sale_price ?? 0, 0);
  const ratingValue = toNumber(item.rating ?? item.average_rating ?? item.avg_rating ?? 4.5, 4.5);
  const imageValue = String(item.image_url ?? item.image ?? item.imageUrl ?? item.thumbnail ?? item.cover ?? '');

  const categoryName =
    typeof item.category === 'string'
      ? item.category
      : typeof item.category === 'object' && item.category !== null && 'name' in item.category
        ? String((item.category as { name?: string }).name ?? '')
        : undefined;

  return {
    id,
    name: String(rawName),
    subtitle: String(rawSubtitle),
    description: typeof item.description === 'string' ? item.description : String(rawSubtitle),
    price: priceValue,
    image: imageValue || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: typeof item.image_alt === 'string' ? item.image_alt : String(rawName),
    rating: ratingValue,
    badge: typeof item.badge === 'string' && item.badge.trim() ? item.badge : undefined,
    categoryName,
    inStock: item.in_stock !== undefined ? Boolean(item.in_stock) : Number(item.stock_quantity ?? 0) > 0,
    is_favorited: toBoolean(item.is_favorited ?? item.isFavorite ?? false),
  };
}

function normalizeCategoryRecord(item: Record<string, unknown>): ProductCategory {
  return {
    id: String(item.id ?? item.category_id ?? item.slug ?? ''),
    name: String(item.name ?? item.title ?? 'فئة'),
    slug: typeof item.slug === 'string' ? item.slug : undefined,
    parent_id: item.parent_id ?? null,
  };
}

function extractPaginationMeta(payload: unknown): PaginatedResponse<Product>['meta'] {
  if (!payload || typeof payload !== 'object') {
    return { current_page: 1, last_page: 1, per_page: 9, total: 0 };
  }

  const record = payload as Record<string, unknown>;
  const meta = record.meta && typeof record.meta === 'object' ? (record.meta as Record<string, unknown>) : {};

  return {
    current_page: toNumber(meta.current_page ?? 1, 1),
    last_page: toNumber(meta.last_page ?? 1, 1),
    per_page: toNumber(meta.per_page ?? record.per_page ?? 9, 9),
    total: toNumber(meta.total ?? 0, 0),
    from: meta.from !== undefined ? Number(meta.from) : null,
    to: meta.to !== undefined ? Number(meta.to) : null,
  };
}

export const productsCatalogApi = {
  async getProducts(filters: ProductFiltersDTO = {}): Promise<PaginatedResponse<Product>> {
    const params: Record<string, number | string> = {
      page: Number(filters.page ?? 1) || 1,
      per_page: Number(filters.per_page ?? 9) || 9,
    };

    if (filters.category_id !== undefined && filters.category_id !== null && filters.category_id !== '') {
      params.category_id = String(filters.category_id);
    }

    // Try primary endpoint first, then fallback to common alternatives on 404
    const endpoints = ['/products', '/product-catalog', '/product-list', '/products/catalog'];

    for (const ep of endpoints) {
      try {
        const response = await customerApi.get<unknown>(ep, { params });
        const payload = response.data;
        const rawItems = extractArray<Record<string, unknown>>(payload);
        const items = rawItems.length > 0 ? rawItems.map(normalizeProductRecord) : [];

        return {
          data: items,
          meta: extractPaginationMeta(payload),
        };
      } catch (err: any) {
        // If 404, try next endpoint; otherwise rethrow
        if (err?.response?.status === 404) {
          continue;
        }
        throw err;
      }
    }

    // If none of the endpoints worked, throw a descriptive error
    const notFoundError: any = new Error('Products endpoint not found on server (404)');
    notFoundError.status = 404;
    throw notFoundError;
  },

  async getCategories(): Promise<ProductCategory[]> {
    const endpoints = ['/categories', '/product-categories', '/categories/list'];

    for (const ep of endpoints) {
      try {
        const response = await customerApi.get<unknown>(ep);
        const rawItems = extractArray<Record<string, unknown>>(response.data);
        return rawItems.map(normalizeCategoryRecord);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          continue;
        }
        throw err;
      }
    }

    const notFoundError: any = new Error('Categories endpoint not found on server (404)');
    notFoundError.status = 404;
    throw notFoundError;
  },

  async getPriceRange(): Promise<ProductPriceRange> {
    try {
      const response = await customerApi.get<unknown>('/products/price-range');
      const payload = response.data && typeof response.data === 'object' ? (response.data as Record<string, unknown>) : {};
      const minPrice = toNumber(payload.min_price ?? payload.minimum_price ?? 0, 0);
      const maxPrice = toNumber(payload.max_price ?? payload.maximum_price ?? 5000, 5000);

      return {
        min_price: minPrice,
        max_price: Math.max(maxPrice, minPrice),
      };
    } catch {
      return { min_price: 0, max_price: 5000 };
    }
  },
};
