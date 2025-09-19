import { Product } from '../types/product';
import productsData from '../data/products.json';
import { subDays } from 'date-fns';
import { assignDisplayBadge } from './product.service';

const CAROUSEL_LIMIT = 4;

export const getHeroCarouselProducts = (): Product[] => {
  console.log(
    '\n--- [HeroCarouselService] Iniciando búsqueda para carrusel ---'
  );

  const allProducts: Product[] = JSON.parse(JSON.stringify(productsData));
  let heroProducts: Product[] = [];

  // --- Cascada de Lógica ---

  // 1. Buscar Novedades (últimos 30 días)
  const thirtyDaysAgo = subDays(new Date(), 30);
  const newProducts = allProducts
    .filter((p) => new Date(p.dateAdded) > thirtyDaysAgo)
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );

  console.log(
    `[Paso 1 - Novedades] Encontrados: ${newProducts.length} productos.`
  );
  heroProducts.push(...newProducts);

  // 2. Si no tenemos suficientes, buscar "Más Vendidos" (simulado con isFeatured)
  if (heroProducts.length < CAROUSEL_LIMIT) {
    const topSellers = allProducts
      .filter((p) => p.isFeatured && !heroProducts.some((hp) => hp.id === p.id))
      .sort((a, b) => b.ratingCount - a.ratingCount);

    console.log(
      `[Paso 2 - Top Sellers] Encontrados: ${topSellers.length} productos.`
    );
    heroProducts.push(...topSellers);
  }

  // 3. Si todavía no tenemos suficientes, buscar Ofertas
  if (heroProducts.length < CAROUSEL_LIMIT) {
    const saleProducts = allProducts.filter(
      (p) =>
        p.originalPrice &&
        p.originalPrice > p.price &&
        !heroProducts.some((hp) => hp.id === p.id)
    );

    console.log(
      `[Paso 3 - Ofertas] Encontrados: ${saleProducts.length} productos.`
    );
    heroProducts.push(...saleProducts);
  }

  // 4. Limitamos y aplicamos la fábrica de badges
  const finalProducts = heroProducts
    .slice(0, CAROUSEL_LIMIT)
    .map(assignDisplayBadge);

  console.log(
    `[Resultado Final] Devolviendo ${finalProducts.length} productos para el carrusel.`
  );
  console.log('--- [HeroCarouselService] Búsqueda finalizada ---\n');

  return finalProducts;
};
