import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config/api';
import { ProductSearchResponse } from '../types/api';
import { useFilters } from '../contexts/FilterContext';

/**
 * @description Define la forma de las opciones de ordenamiento.
 */
export type SortOption = { field: string; order: 'asc' | 'desc' } | null;

/**
 * @description Define la forma del objeto de filtros que se usa para la búsqueda.
 */
export interface Filters {
  q?: string;
  categoryId?: string;
  onSale?: boolean;
  sortBy?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
}

/**
 * @description La función que realiza la llamada a la API para buscar productos.
 * Es usada por TanStack Query.
 * @param context - El objeto de contexto de la query, que contiene la queryKey.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
const searchAPI = async ({
  queryKey,
}: {
  queryKey: any[];
}): Promise<ProductSearchResponse | { suggestions: string[] }> => {
  const [_key, { filters, searchTerm, searchType }] = queryKey;

  const params = new URLSearchParams();
  if (searchTerm) params.append('q', searchTerm);
  if (searchType === 'suggestions') {
    params.append('type', 'suggestions');
  } else {
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.onSale) params.append('onSale', 'true');
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy.field);
      params.append('order', filters.sortBy.order);
    }
    if (filters.tags && filters.tags.length > 0)
      params.append('tags', filters.tags.join(','));
    if (filters.colors && filters.colors.length > 0)
      params.append('colors', filters.colors.join(','));
    if (filters.sizes && filters.sizes.length > 0)
      params.append('sizes', filters.sizes.join(','));
    if (filters.minPrice !== undefined)
      params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined)
      params.append('maxPrice', String(filters.maxPrice));
    if (filters.isNew) {
      params.append('isNew', 'true');
    }
  }

  const url = `${API_BASE_URL}/api/products/search?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch search results');
  return response.json();
};

/**
 * @description Hook para buscar productos. Obtiene los filtros directamente del FilterContext
 * y realiza búsquedas basadas en el estado global de filtros.
 * @param searchTerm - El término de búsqueda actual.
 * @param mode - 'results' para obtener productos completos, 'suggestions' para obtener solo sugerencias.
 * @returns El estado de la query de TanStack Query.
 */
export const useProductSearch = (
  searchTerm: string,
  mode: 'results' | 'suggestions' = 'results',
) => {
  const { filters } = useFilters();
  const { data, status, error, refetch, isFetching } = useQuery({
    // La queryKey ahora incluye el 'searchType'
    queryKey: ['products', { filters, searchTerm, searchType: mode }],
    queryFn: searchAPI,
    // ✨ Solo ejecutamos la query si el modo es 'suggestions' Y hay un término de búsqueda
    enabled: mode === 'suggestions' ? searchTerm.length > 0 : true,
  });

  // Devolvemos una estructura adaptada al modo
  if (mode === 'suggestions') {
    return {
      suggestions: (data as { suggestions: string[] })?.suggestions || [],
      status,
      isLoading: status === 'pending',
    };
  }

  return {
    // Datos de la respuesta
    products: (data as ProductSearchResponse)?.products || [],
    availableFilters: (data as ProductSearchResponse)?.availableFilters,
    priceRange: (data as ProductSearchResponse)?.priceRange,

    // Estados de la query
    status,
    isLoading: status === 'pending',
    isError: status === 'error',
    isFetching,
    error: error as Error | null,
    // Devolvemos 'refetch' para que el componente pueda re-lanzar la búsqueda
    retrySearch: refetch,
  };
};
