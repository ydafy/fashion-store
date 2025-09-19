import { useQuery } from '@tanstack/react-query';
import * as contentService from '../services/content';

export const useFaqData = () => {
  return useQuery({
    queryKey: ['faqData'],
    queryFn: contentService.getFaqData,
  });
};
