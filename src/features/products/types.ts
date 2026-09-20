export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description?: string;
  price: number;
  image: string;
  imageAlt: string;
  rating: number;
  badge?: string;
  categoryName?: string;
  inStock?: boolean;
  stock_quantity?: number;
  reserved_quantity?: number;
  available_stock?: number;
  is_favorited: boolean;
}

export interface ProductCategory {
  id: string | number;
  name: string;
  slug?: string;
  image_url?: string | null;
  parent_id?: string | number | null;
}

export interface ProductFiltersDTO {
  category_id?: number | string | null;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

export interface ProductPriceRange {
  min_price: number;
  max_price: number;
}
