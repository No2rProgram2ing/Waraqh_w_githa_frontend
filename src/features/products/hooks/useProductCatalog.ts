import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { productsCatalogApi } from '@/features/products/api/productsCatalogApi';
import type { ProductFiltersDTO } from '@/features/products/types';

export function useGetProducts(filters: ProductFiltersDTO) {
  return useQuery({
    queryKey: ['products-catalog', filters],
    queryFn: () => productsCatalogApi.getProducts(filters),
    placeholderData: keepPreviousData,
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
