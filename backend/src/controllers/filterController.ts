import { Request, Response } from 'express';
import filtersData from '../data/filters.json';
import productsData from '../data/products.json';
import { tagToGroupMap } from '../utils/filterUtils';
import { getFeaturedQuickFilters } from '../services/filter.service';

type TranslationObject = { es: string; en: string; iconName?: string };

/**
 * @description Calcula y devuelve los filtros disponibles, con los textos ya traducidos.
 */
export const getAvailableFilters = (req: Request, res: Response): void => {
  const { categoryId } = req.query;
  const lang = (req.headers['accept-language'] || 'es').substring(0, 2) as
    | 'es'
    | 'en';

  console.log(
    `[FilterController] GET /api/filters for categoryId: ${categoryId} with lang: ${lang}`
  );

  // 1. Obtener productos relevantes
  const relevantProducts = categoryId
    ? productsData.filter((p) => p.categoryId === categoryId)
    : productsData;

  // 2. Recolectar tags únicos de esos productos
  const allTagsFromProducts = new Set<string>();
  relevantProducts.forEach((product) => {
    (product.tags.es || []).forEach((tag) => allTagsFromProducts.add(tag));
  });

  console.log(
    '[FilterController] Tags encontrados:',
    Array.from(allTagsFromProducts)
  );

  // 3. Usar un mapa para construir los grupos de filtros
  const groupMap: {
    [key: string]: { id: string; name: TranslationObject; options: any[] };
  } = {};

  allTagsFromProducts.forEach((tag) => {
    // ✨ 2. USAMOS EL NUEVO MAPA PARA OBTENER EL GRUPO
    // '.get(tag)' es más limpio y seguro.
    const groupId = tagToGroupMap.get(tag);

    if (groupId) {
      if (!groupMap[groupId]) {
        const groupInfo = filtersData.filterGroupLayout.find(
          (g) => g.id === groupId
        );
        if (groupInfo) {
          groupMap[groupId] = {
            id: groupInfo.id,
            name: groupInfo.name,
            options: []
          };
        }
      }

      const tagDetails =
        filtersData.tagDetails[tag as keyof typeof filtersData.tagDetails];
      if (tagDetails && groupMap[groupId]) {
        groupMap[groupId].options.push({
          value: tag,
          name: tagDetails[lang] || tagDetails.es,
          iconName: (tagDetails as any).iconName
        });
      }
    }
  });

  // 4. Convertimos el mapa a un array, traduciendo el nombre del GRUPO en el proceso
  const allAvailableGroups = filtersData.filterGroupLayout
    .map((layoutGroup) => {
      const groupData = groupMap[layoutGroup.id];
      if (!groupData) return null;

      return {
        id: groupData.id,
        name: groupData.name[lang] || groupData.name.es,
        options: groupData.options // Las opciones ya tienen nombres traducidos
      };
    })
    .filter(
      (group): group is { id: string; name: string; options: any[] } =>
        group !== null
    );

  // 5. Separamos en quick y modal
  const quickFilters = allAvailableGroups.filter((group) =>
    filtersData.quickFilterGroups.includes(group.id)
  );
  const modalFilters = allAvailableGroups.filter((group) =>
    filtersData.modalFilterGroups.includes(group.id)
  );

  // 6. Devolvemos la estructura final con todos los textos como strings
  res.status(200).json({
    quickFilters,
    modalFilters
  });
};

export const getFeaturedFiltersController = (
  req: Request,
  res: Response
): void => {
  try {
    const lang = (req.headers['accept-language'] || 'es').substring(0, 2) as
      | 'es'
      | 'en';
    const supportedLangs = ['es', 'en'];
    const finalLang = supportedLangs.includes(lang) ? lang : 'es';

    const featuredFilters = getFeaturedQuickFilters(finalLang);

    console.log(
      `[FilterController] Serving ${featuredFilters.length} featured quick filters in '${finalLang}'.`
    );
    res.status(200).json(featuredFilters);
  } catch (error) {
    console.error('[FilterController] Error fetching featured filters:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
