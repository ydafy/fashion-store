import { API_BASE_URL } from '../../config/api';
import i18n from '../../config/i18n';

// Asumimos que la respuesta de la API tendrá esta forma
interface PromotionalHubsResponse {
  bestSellers: any; // Podemos tipar esto más estrictamente si es necesario
  // ... otros grupos de hubs en el futuro
}

/**
 * Obtiene los hubs promocionales del backend.
 * La traducción se maneja en el backend basado en el header 'Accept-Language'.
 */
export const getPromotionalHubs =
  async (): Promise<PromotionalHubsResponse> => {
    const lang = i18n.language;
    const headers = { 'Accept-Language': lang };
    const url = `${API_BASE_URL}/api/promotional-hubs`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch promotional hubs');
    }

    return response.json();
  };
