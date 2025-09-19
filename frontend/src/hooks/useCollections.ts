import { useQuery } from '@tanstack/react-query';
import * as contentService from '../services/content';

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: contentService.getCollections,
  });
};
