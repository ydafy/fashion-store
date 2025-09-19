import productsData from '../data/products.json';
import { Product } from '../types/product';
import { assignDisplayBadge } from './product.service'; // Importamos el servicio existente

/**
 * Obtiene los 3 productos con el mayor descuento.
 */
export const getFeaturedSaleProducts = (): Product[] => {
  // 1. Filtramos productos que están en oferta
  const productsWithDiscount = (productsData as Product[]).filter(
    (p) => p.originalPrice !== null && p.originalPrice > p.price
  );

  // 2. Calculamos y ordenamos por el mayor porcentaje de descuento
  productsWithDiscount.sort((a, b) => {
    const discountA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
    const discountB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
    return discountB - discountA;
  });

  // 3. Tomamos los 3 primeros y les asignamos sus badges
  const top3Products = productsWithDiscount.slice(0, 3);
  return top3Products.map(assignDisplayBadge);
};
