import { useQuery } from '@tanstack/react-query';
import { getFeaturedColors } from '../services/color';
import i18n from '../config/i18n';

export const useFeaturedColors = () => {
  const lang = i18n.language;
  return useQuery({
    queryKey: ['featuredColors', lang],
    queryFn: getFeaturedColors,
    staleTime: 1000 * 60 * 30, // 30 minutos de cache
  });
};
