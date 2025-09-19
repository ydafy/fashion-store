import { useQuery } from '@tanstack/react-query';
import * as productService from '../services/product';

export const useLatestProducts = (limit: number = 6) => {
  return useQuery({
    queryKey: ['products', 'latest', limit],
    queryFn: () => productService.getProducts({ sortBy: 'dateAdded', limit }),
  });
};
