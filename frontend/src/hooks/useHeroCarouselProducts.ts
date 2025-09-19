import { useQuery } from '@tanstack/react-query';
import * as productService from '../services/product';

export const useHeroCarouselProducts = () => {
  return useQuery({
    queryKey: ['products', 'hero-carousel'],

    queryFn: () => productService.getProducts({ forHeroCarousel: true }),
  });
};
