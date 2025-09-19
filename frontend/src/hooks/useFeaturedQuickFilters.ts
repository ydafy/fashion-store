import { useQuery } from '@tanstack/react-query';
import { getFeaturedQuickFilters } from '../services/filter';
import i18n from '../config/i18n';

export const useFeaturedQuickFilters = () => {
  const lang = i18n.language;
  return useQuery({
    queryKey: ['featuredQuickFilters', lang], // La clave depende del idioma
    queryFn: getFeaturedQuickFilters,
    staleTime: 1000 * 60 * 30, // 30 minutos, estos filtros no cambian a menudo
  });
};
