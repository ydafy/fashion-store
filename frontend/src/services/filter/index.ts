import { API_BASE_URL } from '../../config/api';
import { QueryFunctionContext } from '@tanstack/react-query';
// ✨ Importamos el nuevo tipo de respuesta
import { AvailableFiltersResponse } from '../../types/filter';
import { QuickFilter } from '../../types/quickFilter';
import i18n from '../../config/i18n';

type FiltersQueryKey = [string, string, string | undefined];

/**
 * @description Obtiene los filtros disponibles, separados en quick y modal.
 * @param context - El contexto de la query de TanStack.
 * @returns Una promesa que se resuelve con un objeto AvailableFiltersResponse.
 */
export const getAvailableFiltersAPI = async (
  context: QueryFunctionContext<FiltersQueryKey>,
): Promise<AvailableFiltersResponse> => {
  // ✨ La función ahora devuelve este tipo
  const [categoryId] = context.queryKey;

  let url = `${API_BASE_URL}/api/filters`;
  if (categoryId) {
    url += `?categoryId=${categoryId}`;
  }

  const response = await fetch(url); // No necesitamos pasar headers si el idioma no se usa aquí

  if (!response.ok) throw new Error('Failed to fetch filters');

  const data = await response.json();
  console.log(
    '[FilterService] Datos RECIBIDOS:',
    JSON.stringify(data, null, 2),
  );
  return data;
};

export const getFeaturedQuickFilters = async (): Promise<QuickFilter[]> => {
  const lang = i18n.language;
  const headers = { 'Accept-Language': lang };
  const url = `${API_BASE_URL}/api/filters/featured`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch featured quick filters');
  }

  return response.json();
};
