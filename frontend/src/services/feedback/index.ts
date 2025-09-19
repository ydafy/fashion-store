import { API_BASE_URL } from '../../config/api';

export interface FaqFeedbackPayload {
  questionId: string;
  vote: 'up' | 'down';
}

/**
 * @description Envía el feedback de un usuario sobre una pregunta del FAQ.
 *              Es una función "dispara y olvida" (fire-and-forget).
 * @param payload - Contiene el ID de la pregunta y el voto.
 */
export const submitFaqFeedback = async (
  payload: FaqFeedbackPayload,
): Promise<void> => {
  try {
    // No necesitamos esperar la respuesta ('await').
    fetch(`${API_BASE_URL}/api/feedback/faq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Si el logging falla, solo lo mostramos en la consola del desarrollador.
    console.warn('[FeedbackService] Failed to submit FAQ feedback:', error);
  }
};
