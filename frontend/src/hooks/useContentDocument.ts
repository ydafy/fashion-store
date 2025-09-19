import { useQuery } from '@tanstack/react-query';
import * as contentService from '../services/content';

/**
 * @description Hook de TanStack Query para obtener el contenido de un documento.
 *              Maneja el fetching, caching, y los estados de carga/error.
 * @param documentType - El tipo de documento a obtener.
 */
export const useContentDocument = (documentType: string) => {
  return useQuery({
    queryKey: ['content', documentType], // Clave de caché única
    queryFn: () => contentService.getContentDocument(documentType),
    enabled: !!documentType, // La query solo se ejecutará si documentType no es nulo/undefined
  });
};
