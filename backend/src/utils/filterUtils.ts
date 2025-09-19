import filtersData from '../data/filters.json';

/**
 * @description Crea un mapa que asocia cada tag con el ID de su grupo de filtros.
 * Se construye dinámicamente desde filters.json para evitar la duplicación de datos.
 * @returns {Map<string, string>} Un mapa donde la clave es el tag y el valor es el ID del grupo.
 */
const createTagToGroupMap = (): Map<string, string> => {
  const map = new Map<string, string>();
  filtersData.filterGroupLayout.forEach((group) => {
    group.tags.forEach((tag) => {
      map.set(tag, group.id);
    });
  });
  return map;
};

// Creamos el mapa una sola vez cuando el servidor se inicia, para máxima eficiencia.
export const tagToGroupMap = createTagToGroupMap();
