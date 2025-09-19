import { API_BASE_URL } from '../../config/api';
import { ChatPayload } from '../../hooks/useChatbot'; // ✨ Importamos el tipo

interface ChatResponse {
  answer: string;
}

/**
 * @description Envía una pregunta y el historial al backend.
 * @param payload - Contiene la pregunta y el historial.
 * @returns La respuesta generada por la IA.
 */
export const getChatbotResponse = async (
  payload: ChatPayload,
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // ✨ Enviamos el payload completo en el body
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to get a response from the assistant.');
  }

  const data: ChatResponse = await response.json();
  return data.answer;
};
