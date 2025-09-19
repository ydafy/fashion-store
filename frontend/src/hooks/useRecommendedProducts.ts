import { useQuery } from '@tanstack/react-query';
import * as productService from '../services/product';

export const useRecommendedProducts = () => {
  return useQuery({
    queryKey: ['products', 'recommended'],
    // Asumimos que tu servicio de productos tiene una función para esto
    // Si no, podemos adaptarla para que llame a /api/products?isFeatured=true
    queryFn: () => productService.getProducts({ isFeatured: true }),
  });
};
