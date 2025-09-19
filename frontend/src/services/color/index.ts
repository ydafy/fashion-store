import { API_BASE_URL } from '../../config/api';
import i18n from '../../config/i18n';
import { FeaturedColor } from '../../types/featuredColor';

export const getFeaturedColors = async (): Promise<FeaturedColor[]> => {
  const lang = i18n.language;
  const headers = { 'Accept-Language': lang };
  const url = `${API_BASE_URL}/api/colors/featured`;

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error('Failed to fetch featured colors');
  return response.json();
};
