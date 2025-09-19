import { API_BASE_URL } from '../../config/api';
import { PickupLocation } from '../../types/pickup_location'; // Asegúrate que la ruta al tipo sea correcta
import { Country } from '../../types/locations';

const PICKUP_API_URL = `${API_BASE_URL}/api/locations/pickup`;
const HIERARCHICAL_API_URL = `${API_BASE_URL}/api/locations/hierarchical`;

/**
 * @description Obtiene las ubicaciones de recogida, filtradas por ciudad y país.
 * @param {string} city - La ciudad de la dirección del usuario.
 * @param {string} country - El país de la dirección del usuario.
 * @returns {Promise<PickupLocation[]>} Un array con las ubicaciones filtradas.
 *
 * const url = new URL(PICKUP_API_URL);
 */
const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const getPickupLocations = async (
  city: string,
  country: string,
): Promise<PickupLocation[]> => {
  const url = new URL(PICKUP_API_URL);

  // ✨ 2. NORMALIZAMOS LOS DATOS ANTES DE ENVIARLOS
  url.searchParams.append('city', normalize(city));
  url.searchParams.append('country', normalize(country));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch pickup locations');
  }
  return response.json();
};

// ✨ 2. AÑADE ESTA NUEVA FUNCIÓN ✨

/**
 * @description Obtiene la estructura jerárquica completa de locaciones (País > Estado > Ciudad).
 * @returns Una promesa que se resuelve con un array de países.
 */
export const getHierarchicalLocations = async (): Promise<Country[]> => {
  try {
    const response = await fetch(HIERARCHICAL_API_URL);
    if (!response.ok) {
      // En un futuro, podrías leer el mensaje de error del backend
      throw new Error('Failed to fetch hierarchical locations');
    }
    const data: Country[] = await response.json();
    return data;
  } catch (error) {
    console.error(
      '[LocationService] Error fetching hierarchical locations:',
      error,
    );
    // Re-lanzamos el error para que el componente que llama pueda manejarlo.
    throw error;
  }
};
