import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import { getAvailableFiltersAPI } from '../services/filter';
import i18n from '../config/i18n';
import { AvailableFiltersResponse, FilterGroup } from '../types/filter';

type FiltersQueryKey = [string, string, string | undefined];

/**
 * @description Custom hook para obtener los filtros dinámicos (rápidos y de modal)
 * para una categoría específica.
 * @param categoryId - El ID de la subcategoría.
 */
export const useCategoryFilters = (categoryId: string | undefined) => {
  const lang = i18n.language;

  const { data, status, error } = useQuery<
    AvailableFiltersResponse,
    Error,
    AvailableFiltersResponse,
    FiltersQueryKey
  >({
    queryKey: ['filters', lang, categoryId],
    queryFn: getAvailableFiltersAPI,
    enabled: !!categoryId
  });

  return {
    // ✨ Devolvemos las dos listas por separado, con un fallback a array vacío
    quickFilters: data?.quickFilters || [],
    modalFilters: data?.modalFilters || [],
    status,
    error
  };
};
