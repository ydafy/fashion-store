import { Product, DisplayBadge } from '../types/product';
import productsData from '../data/products.json';
import { subDays } from 'date-fns';

const CAROUSEL_LIMIT = 4;

/**
 * @description "Fábrica de Badges". Analiza un producto y le asigna el badge
 *              más relevante según una jerarquía de prioridades.
 * @param product - El objeto de producto a analizar.
 * @returns El producto, posiblemente modificado con una propiedad 'displayBadge'.
 */
export const assignDisplayBadge = (product: Product): Product => {
  // Hacemos una copia para no mutar el objeto original
  const productWithBadge = { ...product };

  // --- Jerarquía de Prioridades ---

  // Prioridad 1: ¿Está en oferta?
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    productWithBadge.displayBadge = {
      textKey: `product:card.badge.discountOff::${discount}`,
      type: 'sale'
    };
    return productWithBadge; // Encontramos el más importante, terminamos.
  }

  // Prioridad 2: ¿Es un "Top Seller"? (Simulado)
  // En un backend real, esto vendría de una tabla de análisis de ventas.
  // Aquí, lo simularemos con una combinación de rating alto y muchas reseñas.
  if (product.rating >= 4.5 && product.ratingCount > 100) {
    productWithBadge.displayBadge = {
      textKey: 'product:card.badge.topSeller',
      type: 'topSeller'
    };
    return productWithBadge;
  }

  // Prioridad 3: ¿Es nuevo? (Últimos 30 días)
  const thirtyDaysAgo = subDays(new Date(), 30);
  if (new Date(product.dateAdded) > thirtyDaysAgo) {
    productWithBadge.displayBadge = {
      textKey: 'product:card.badge.new',
      type: 'new'
    };
    return productWithBadge;
  }

  // Si no cumple ninguna condición, no se añade ningún badge.
  return productWithBadge;
};
