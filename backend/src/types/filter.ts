/**
 * @description Representa una única opción dentro de un grupo de filtros (ej. "Largos").
 */
export interface FilterOption {
  value: string; // El valor del tag que se usará en la API (ej. 'tag-largo')
  name: string; // El nombre que se muestra en la UI (ej. 'Largos')
}

/**
 * @description Representa un grupo de filtros (ej. "Estilo").
 */
export interface FilterGroup {
  id: string;
  name: string; // El título del grupo de filtros (ej. 'Estilo')
  options: FilterOption[];
}
