import { Request, Response } from 'express';
import productsData from '../data/products.json';
import filtersData from '../data/filters.json';
import { Product } from '../types/product';
import { assignDisplayBadge } from '../services/product.service';
import {
  ApiFilterGroup,
  ApiFilterOption,
  ProductSearchResponse
} from '../types/api';

import categoriesData from '../data/categories.json';
import { tagToGroupMap } from '../utils/filterUtils';
import { subDays } from 'date-fns';

// --- (Las funciones getAllProducts y getProductById se mantienen igual) ---
export const getAllProducts = (req: Request, res: Response): void => {
  let results: Product[] = [...productsData];
  const { categoryId, q, onSale, isFeatured, limit, isNew } = req.query;

  if (isFeatured === 'true') {
    results = results.filter((p) => p.isFeatured);
  }
  if (isNew === 'true') {
    const thirtyDaysAgo = subDays(new Date(), 60);
    results = results.filter((p) => new Date(p.dateAdded) > thirtyDaysAgo);
  }

  if (typeof categoryId === 'string') {
    results = results.filter((p) => p.categoryId === categoryId);
  }

  if (typeof q === 'string') {
    const searchTerm = q.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.es.toLowerCase().includes(searchTerm) ||
        p.name.en.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm)
    );
  }

  if (onSale === 'true') {
    results = results.filter((p) => p.originalPrice !== null);
  }

  results.sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  // --- LÍMITE ---
  let paginatedResults = results;
  if (typeof limit === 'string' && !isNaN(parseInt(limit, 10))) {
    paginatedResults = results.slice(0, parseInt(limit, 10));
  }

  // ✨ LA SOLUCIÓN: APLICAMOS LOS BADGES ANTES DE ENVIAR LA RESPUESTA
  const resultsWithBadges = paginatedResults.map(assignDisplayBadge);

  res.status(200).json(resultsWithBadges);
};

export const getProductById = (req: Request, res: Response): void => {
  const { productId } = req.params;
  const product = productsData.find((p) => p.id === productId);
  if (product) {
    const productWithBadge = assignDisplayBadge(product);
    res.json(productWithBadge);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

// --- Controlador para BÚSQUEDA y FILTRADO de productos ---
export const searchProducts = (req: Request, res: Response): void => {
  const {
    q,
    categoryId,
    type,
    tags: tagsQuery,
    minPrice,
    maxPrice,
    sortBy,
    order = 'asc',
    onSale,
    colors: colorsQuery,
    sizes: sizesQuery,
    isNew
  } = req.query;
  const lang = (req.headers['accept-language'] || 'es').substring(0, 2) as
    | 'es'
    | 'en';

  // --- LÓGICA PARA SUGERENCIAS ✨ ---
  if (type === 'suggestions' && q && typeof q === 'string') {
    const searchTerm = q.toLowerCase();
    const suggestions = new Set<string>(); // Usamos un Set para evitar duplicados

    // 1. Buscar en nombres de productos
    productsData.forEach((p) => {
      const name = p.name[lang] || p.name.es;
      if (name.toLowerCase().includes(searchTerm)) {
        suggestions.add(name);
      }
    });

    // 2. Buscar en marcas
    productsData.forEach((p) => {
      if (p.brand.toLowerCase().includes(searchTerm)) {
        suggestions.add(p.brand);
      }
    });

    // 3. Buscar en categorías y subcategorías
    categoriesData.forEach((cat) => {
      const catName = cat.name[lang] || cat.name.es;
      if (catName.toLowerCase().includes(searchTerm)) {
        suggestions.add(catName);
      }
      cat.subcategories.forEach((sub) => {
        const subName = sub.name[lang] || sub.name.es;
        if (subName.toLowerCase().includes(searchTerm)) {
          suggestions.add(subName);
        }
      });
    });

    // Limitamos a 10 sugerencias y las convertimos a un array
    const limitedSuggestions = Array.from(suggestions).slice(0, 10);

    console.log(
      `[ProductController] Found ${limitedSuggestions.length} suggestions for "${q}"`
    );
    res.json({ suggestions: limitedSuggestions });
    return;
  }

  // --- FASE 1: FILTRADO ---

  let prePriceFilterResults: Product[] = [...productsData];

  if (isNew === 'true') {
    const thirtyDaysAgo = subDays(new Date(), 30);
    prePriceFilterResults = prePriceFilterResults.filter(
      (p) => new Date(p.dateAdded) > thirtyDaysAgo
    );
  }

  if (categoryId && typeof categoryId === 'string') {
    prePriceFilterResults = prePriceFilterResults.filter(
      (p) => p.categoryId === categoryId
    );
  }
  if (q && typeof q === 'string') {
    const searchTerm = q.toLowerCase();
    prePriceFilterResults = prePriceFilterResults.filter(
      (p) =>
        p.name.es.toLowerCase().includes(searchTerm) ||
        p.name.en.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm)
    );
  }
  if (tagsQuery && typeof tagsQuery === 'string') {
    const requiredTags = tagsQuery.split(',');
    if (requiredTags.length > 0) {
      // Buena práctica añadir esta comprobación
      prePriceFilterResults = prePriceFilterResults.filter((product) => {
        // ✅ CORRECCIÓN DEL BUG: Usar el idioma detectado en lugar de hardcodear 'es'
        const productTags = product.tags[lang] || product.tags.es || [];
        return requiredTags.some((tag) => productTags.includes(tag));
      });
    }
  }
  if (onSale === 'true') {
    prePriceFilterResults = prePriceFilterResults.filter(
      (p) => p.originalPrice !== null && p.originalPrice > p.price
    );
  }
  if (colorsQuery && typeof colorsQuery === 'string') {
    const requiredColors = colorsQuery.split(',');
    prePriceFilterResults = prePriceFilterResults.filter((p) =>
      p.variants.some((variant) => requiredColors.includes(variant.colorCode))
    );
  }
  if (sizesQuery && typeof sizesQuery === 'string') {
    const requiredSizes = sizesQuery.split(',');
    prePriceFilterResults = prePriceFilterResults.filter((p) =>
      p.variants.some((variant) =>
        variant.inventory.some(
          (inv) => requiredSizes.includes(`size-${inv.size}`) && inv.stock > 0
        )
      )
    );
  }

  let priceRange = { min: 0, max: 0 };
  if (prePriceFilterResults.length > 0) {
    const prices = prePriceFilterResults.map((p) => p.price);
    priceRange = {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }

  // --- FASE 3: APLICAR FILTROS DE PRECIO DEL USUARIO ---
  let results = [...prePriceFilterResults];
  if (minPrice && !isNaN(Number(minPrice))) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  // --- FASE 2: AGREGACIÓN DE FILTROS DISPONIBLES ---
  // (Esta lógica se ejecuta sobre la lista ya filtrada)

  const availableColors = new Map<string, ApiFilterOption>();
  const availableSizes = new Set<string>();
  const availableContextualTags = new Set<string>();

  results.forEach((product) => {
    // ✅ CORRECCIÓN: Usar el idioma detectado para tags contextuales también
    const productTags = product.tags[lang] || product.tags.es || [];
    productTags.forEach((tag) => {
      if (tag.startsWith('attr-')) {
        availableContextualTags.add(tag);
      }
    });
    product.variants.forEach((variant) => {
      if (!availableColors.has(variant.colorCode)) {
        availableColors.set(variant.colorCode, {
          value: variant.colorCode,
          name: variant.colorName[lang] || variant.colorName.es,
          hex: variant.colorCode
        });
      }
      variant.inventory.forEach((inv) => {
        availableSizes.add(String(inv.size));
      });
    });
  });

  const groupMap: { [key: string]: ApiFilterGroup } = {};
  availableContextualTags.forEach((tag) => {
    // ✨ 2. USAMOS EL NUEVO MAPA PARA OBTENER EL GRUPO
    const groupId = tagToGroupMap.get(tag);

    if (groupId) {
      if (!groupMap[groupId]) {
        const groupInfo = filtersData.filterGroupLayout.find(
          (g) => g.id === groupId
        );
        if (groupInfo) {
          groupMap[groupId] = {
            id: groupInfo.id,
            name: groupInfo.name[lang] || groupInfo.name.es,
            options: []
          };
        }
      }
      const tagDetails =
        filtersData.tagDetails[tag as keyof typeof filtersData.tagDetails];
      if (tagDetails && groupMap[groupId]) {
        groupMap[groupId].options.push({
          value: tag,
          name: tagDetails[lang] || tagDetails.es
        });
      }
    }
  });

  const sortedGroups = filtersData.filterGroupLayout
    .map((lg) => groupMap[lg.id])
    .filter(Boolean);
  const quickFilters = sortedGroups.filter((g) =>
    filtersData.quickFilterGroups.includes(g.id)
  );
  const modalFilters = sortedGroups.filter((g) =>
    filtersData.modalFilterGroups.includes(g.id)
  );

  // --- ✨ FASE 3: ORDENAMIENTO (se aplica a 'results') ✨ ---
  if (sortBy === 'price') {
    results.sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
  } else if (sortBy === 'name') {
    results.sort((a, b) => {
      const nameA = (a.name[lang] || a.name.es).toLowerCase();
      const nameB = (b.name[lang] || b.name.es).toLowerCase();
      if (nameA < nameB) return order === 'asc' ? -1 : 1;
      if (nameA > nameB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  } else if (sortBy === 'dateAdded') {
    results.sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
  }

  // --- FASE 4: PAGINACIÓN (Futuro) ---
  const paginatedResults = results; // Por ahora, la lista completa

  // --- FASE 5: CONSTRUCCIÓN DE LA RESPUESTA FINAL ---
  const responsePayload: ProductSearchResponse = {
    products: paginatedResults.map(assignDisplayBadge),
    availableFilters: {
      quickFilters,
      modalFilters,
      colors: Array.from(availableColors.values()),
      sizes: Array.from(availableSizes)
        .sort((a, b) => {
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return a.localeCompare(b);
        })
        .map((s) => ({ value: `size-${s}`, name: s.toUpperCase() }))
    },
    priceRange,
    totalPages: 1,
    currentPage: 1,
    totalProducts: results.length
  };

  res.json(responsePayload);
};
