import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductsByIds } from '../services/product';
import { getRecentlyViewed } from '../services/recentlyViewed';

export const useProductStrip = (type: 'newArrivals' | 'recentlyViewed') => {
  return useQuery({
    // La queryKey ahora depende del tipo para asegurar el re-fetching
    queryKey: ['productStrip', type],
    queryFn: async () => {
      if (type === 'newArrivals') {
        return getProducts({ isNew: true, limit: 10 });
      } else {
        // recentlyViewed
        const recentlyViewedItems = await getRecentlyViewed();
        const productIds = recentlyViewedItems
          .slice(0, 8)
          .map((item) => item.productId);

        if (productIds.length > 0) {
          return getProductsByIds(productIds);
        }

        return []; // Devuelve un array vacío si no hay items vistos
      }
    },
    staleTime:
      type === 'newArrivals'
        ? 1000 * 60 * 5 // 5 minutos para novedades
        : 1000 * 30, // 30 segundos para recently viewed
  });
};
