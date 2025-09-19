import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config/api';

// Este tipo define la "forma" de los datos que esperamos del backend.
export interface FaqStats {
  [questionId: string]: {
    up: number;
    down: number;
  };
}

// Esta es la función que realmente hace la llamada a la API.
const getFaqStats = async (): Promise<FaqStats> => {
  const response = await fetch(`${API_BASE_URL}/api/feedback/faq-stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch FAQ stats.');
  }
  return response.json();
};

// Este es el hook que nuestros componentes usarán.
// TanStack Query se encarga de llamar a getFaqStats, el caching, etc.
export const useFaqFeedbackStats = () => {
  return useQuery({
    queryKey: ['faqStats'], // La clave de caché para estos datos
    queryFn: getFaqStats,
  });
};
