import filtersData from '../data/filters.json';
import featuredContent from '../data/featuredContent.json';
import { TranslationObject } from '../types/product'; // Reutilizamos este tipo

// Definimos un tipo local para mayor claridad
type TagDetails = {
  [key: string]: TranslationObject & { iconName?: string };
};

/**
 * Obtiene los detalles de los filtros rápidos destacados para la ComprarScreen.
 * @param lang - El idioma solicitado ('es' o 'en').
 * @returns Un array de objetos de filtro listos para el frontend.
 */
export const getFeaturedQuickFilters = (lang: 'es' | 'en') => {
  const featuredTags = featuredContent.comprarScreen.featuredQuickFilterTags;
  const tagDetails = filtersData.tagDetails as TagDetails;

  const translatedFilters = featuredTags
    .map((tagId) => {
      const details = tagDetails[tagId];
      if (!details) {
        console.warn(`[FilterService] Tag details not found for ID: ${tagId}`);
        return null;
      }

      return {
        id: tagId,
        // Seleccionamos la traducción, con fallback a español
        title: details[lang] || details.es,
        iconName: details.iconName || 'Question' // Fallback a un icono de pregunta
      };
    })
    .filter(Boolean); // Filtramos cualquier nulo si un tag no se encontrara

  return translatedFilters;
};
