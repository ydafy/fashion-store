import { Filters } from '../hooks/useProductSearch';
/**
 * @description Representa una única opción dentro de un grupo de filtros (ej. "Largos").
 */
export interface FilterOption {
  value: string; // El valor del tag que se usará en la API (ej. 'tag-largo')
  name: string; // El nombre que se muestra en la UI (ej. 'Largos')
  iconName?: string;
}

/**
 * @description Define la estructura para almacenar los filtros,
 * donde cada clave es un categoryId y el valor es el objeto de filtros para esa categoría.
 * @example { 'sub-cat-vestidos': { sortBy: 'price', onSale: true } }
 */
export type FilterState = {
  [categoryId: string]: Filters;
};

/**
 * @description Representa un grupo de filtros (ej. "Estilo").
 */
export interface FilterGroup {
  id: string;
  name: string; // El título del grupo de filtros (ej. 'Estilo')
  options: FilterOption[];
}

/**
 * @description Representa la respuesta completa de la API de filtros,
 * separando los filtros rápidos de los del modal.
 */
export interface AvailableFiltersResponse {
  quickFilters: FilterGroup[];
  modalFilters: FilterGroup[];
}
