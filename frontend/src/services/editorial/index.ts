// Servicio para obtener las tarjetas editoriales desde la API

import { API_BASE_URL } from '../../config/api';
import i18n from '../../config/i18n';
import { EditorialCard } from '../../types/editorial';

export const getEditorials = async (): Promise<EditorialCard[]> => {
  const lang = i18n.language;
  const headers = { 'Accept-Language': lang };
  const url = `${API_BASE_URL}/api/editorials`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch editorials');
  }
  return response.json();
};
