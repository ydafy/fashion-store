import { API_BASE_URL } from '../../config/api';
import i18n from '../../config/i18n'; // Para obtener el idioma actual

import { Category } from '../../types/category'; // Crearemos este tipo en el siguiente paso

/**
 * @description Obtiene la lista completa de categorías y subcategorías desde la API.
 * Solicita los datos en el idioma actual de la aplicación.
 * @returns Una promesa que se resuelve con un array de Category.
 */
export const getCategories = async (): Promise<Category[]> => {
  const lang = i18n.language;
  const headers = { 'Accept-Language': lang };

  const response = await fetch(`${API_BASE_URL}/api/categories`, { headers });

  if (!response.ok) {
    // En una app real, podrías manejar diferentes códigos de error
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();
  return data;
};
