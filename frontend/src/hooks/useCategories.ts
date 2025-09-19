import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/category'; // ✨ Llama al servicio de CATEGORÍAS
import i18n from '../config/i18n';

/**
 * @description Custom hook para obtener la lista de categorías principales para la ComprarScreen.
 * Maneja el fetching, caching, y los estados de carga y error usando TanStack Query.
 */
export const useCategories = () => {
  const lang = i18n.language;

  const { data, status, error, refetch } = useQuery({
    // La clave depende solo del idioma
    queryKey: ['categories', lang],

    // La función que se ejecuta para obtener los datos
    queryFn: getCategories,

    staleTime: 1000 * 60 * 5 // 5 minutos
  });

  return {
    categories: data, // ✨ Devuelve 'categories'
    status,
    error,
    refetchCategories: refetch // ✨ Devuelve 'refetchCategories'
  };
};
