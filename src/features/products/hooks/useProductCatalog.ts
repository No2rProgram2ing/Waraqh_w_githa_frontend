import { useQuery } from '@tanstack/react-query';

import { productsCatalogApi } from '@/features/products/api/productsCatalogApi';
import type { ProductFiltersDTO } from '@/features/products/types';

export function useGetProducts(filters: ProductFiltersDTO) {
  const key = [
    'products-catalog',
    Number(filters.page ?? 1),
    Number(filters.per_page ?? 9),
    filters.category_id ?? null,
    filters.search ?? '',
  ];

  return useQuery({
    queryKey: key,
    queryFn: () => productsCatalogApi.getProducts(filters),
    keepPreviousData: true,
    staleTime: 30_000,
  });
}

export function useGetCategories() {
  return useQuery({
    queryKey: ['products-catalog-categories'],
    queryFn: () => productsCatalogApi.getCategories(),
    staleTime: 60_000,
  });
}

export function useGetPriceRange() {
  return useQuery({
    queryKey: ['products-catalog-price-range'],
    queryFn: () => productsCatalogApi.getPriceRange(),
    staleTime: 60_000,
  });
}
