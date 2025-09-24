import { API_BASE_URL } from '../../config/api';
import { Product } from '../../types/product';
import i18n from '../../config/i18n';

interface GetProductsParams {
  isFeatured?: boolean;
  sortBy?: 'dateAdded';
  limit?: number;
  isNew?: boolean;
  forHeroCarousel?: boolean;
}

/**
 * @description Obtiene una lista de productos del backend. Es nuestra única
 *              función para obtener listas de productos.
 * @param params - Un objeto con opciones de filtrado y ordenamiento.
 * @returns Una promesa que se resuelve con un array de Product.
 */
export const getProducts = async (
  params: GetProductsParams = {},
): Promise<Product[]> => {
  // ✨ 2. DECIDIMOS A QUÉ ENDPOINT LLAMAR
  let endpoint = '/api/products';
  if (params.forHeroCarousel) {
    endpoint = '/api/products/hero-carousel';
  }

  const queryParams = new URLSearchParams();
  if (params.isFeatured) queryParams.append('isFeatured', 'true');
  if (params.isNew) queryParams.append('isNew', 'true');
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.limit) queryParams.append('limit', String(params.limit));

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  const lang = i18n.language;
  const headers = { 'Accept-Language': lang };

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch products from ${url}`);
  }
  return response.json();
};
/**
 * @description Obtiene un único producto por su ID.
 * @param productId - El ID del producto a obtener.
 * @returns Una promesa que se resuelve con el objeto Product.
 */
export const getProductById = async (productId: string): Promise<Product> => {
  const lang = i18n.language;
  const headers = { 'Accept-Language': lang };

  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }

  const data = await response.json();
  return data;
};

export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return []; // No hacer una llamada a la API si no hay IDs

  const params = new URLSearchParams();
  params.append('ids', ids.join(','));

  const url = `${API_BASE_URL}/api/batch/products?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products by IDs');
  return response.json();
};
