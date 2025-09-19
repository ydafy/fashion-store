import { API_BASE_URL } from '../../config/api';
import { FaqCategory } from '../../types/faq';
import { SectionCardData } from '../../types/components';

interface ContentResponse {
  content: string;
}

/**
 * @description Obtiene el contenido de un documento desde el backend.
 * @param documentType - El tipo de documento a obtener (ej. 'terms', 'privacy').
 * @returns El contenido del documento en formato Markdown.
 */
export const getContentDocument = async (
  documentType: string,
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/content/${documentType}`);

  if (!response.ok) {
    throw new Error('Failed to fetch document content.');
  }

  const data: ContentResponse = await response.json();
  return data.content;
};

export const getFaqData = async (): Promise<FaqCategory[]> => {
  const response = await fetch(`${API_BASE_URL}/api/faq`);
  if (!response.ok) {
    throw new Error('Failed to fetch FAQ data.');
  }
  return response.json();
};

export const getCollections = async (): Promise<SectionCardData[]> => {
  // Asumimos que este es el endpoint correcto para las colecciones
  const response = await fetch(`${API_BASE_URL}/api/sections`);
  if (!response.ok) {
    throw new Error('Failed to fetch collections data.');
  }
  return response.json();
};
