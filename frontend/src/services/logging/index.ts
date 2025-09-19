import { API_BASE_URL } from '../../config/api';

/**
 * @description Registra la pregunta de un usuario en el backend para analíticas.
 *              Es una función "dispara y olvida" (fire-and-forget).
 * @param question - La pregunta del usuario.
 */
export const logUserQuestion = async (question: string): Promise<void> => {
  try {
    // No necesitamos esperar la respuesta ('await'), ni nos importa si falla.
    // Simplemente enviamos el log.
    fetch(`${API_BASE_URL}/api/logs/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
  } catch (error) {
    // Si el logging falla, no queremos que afecte la experiencia del usuario.
    // Simplemente lo registramos en la consola del desarrollador.
    console.warn('[LoggingService] Failed to log user question:', error);
  }
};
