import { useQuery } from '@tanstack/react-query';
import { Product } from '../types/product';
import { API_BASE_URL } from '../config/api';
import i18n from '../config/i18n';

const getFeaturedSaleAPI = async (): Promise<Product[]> => {
  const lang = i18n.language;
  const headers = { 'Accept-Language': lang };
  const url = `${API_BASE_URL}/api/featured-sale/products`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch featured sale products');
  }
  return response.json();
};

export const useFeaturedSaleProducts = () => {
  const lang = i18n.language;
  return useQuery({
    queryKey: ['featuredSaleProducts', lang],
    queryFn: getFeaturedSaleAPI,
    staleTime: 1000 * 60 * 15, // 15 minutos de cache
  });
};
