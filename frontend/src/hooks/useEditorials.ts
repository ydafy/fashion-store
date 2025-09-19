import { useQuery } from '@tanstack/react-query';
import { getEditorials } from '../services/editorial';
import i18n from '../config/i18n';

export const useEditorials = () => {
  const lang = i18n.language;
  return useQuery({
    queryKey: ['editorials', lang],
    queryFn: getEditorials,
    staleTime: 1000 * 60 * 30, // 30 minutos de cache
  });
};
