import { useQuery } from '@tanstack/react-query';
import { getPromotionalHubs } from '../services/promotionalHub';

export const usePromotionalHubs = () => {
  return useQuery({
    queryKey: ['promotionalHubs'],
    queryFn: getPromotionalHubs,
    staleTime: 1000 * 60 * 15, // Cache de 15 minutos, los hubs no cambian tan a menudo
  });
};
