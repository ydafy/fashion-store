/**
 * @fileoverview Utilidades centralizadas para el manejo de errores en toda la aplicación.
 */

/**
 * @description Representa la estructura de un error procesado.
 */
export interface ProcessedError {
  messageKey: string;
  fallbackMessage: string;
}

/**
 * @description Procesa un error de tipo 'unknown' y extrae de forma segura
 *              una 'messageKey' y un 'fallbackMessage'.
 *              Esta es nuestra utilidad central para manejar errores de 'catch'
 *              de una manera que cumple con las reglas de 'no-explicit-any'.
 *
 * @param e El error capturado, de tipo 'unknown'.
 * @param defaultMessageKey La clave de i18n a usar si no se encuentra una específica.
 * @returns Un objeto ProcessedError con la información del error.
 */
export const processUnknownError = (
  e: unknown,
  defaultMessageKey: string = 'common:genericError',
): ProcessedError => {
  let messageKey = defaultMessageKey;
  let fallbackMessage = 'An unexpected error occurred.';

  // Comprobamos de forma segura si 'e' es un objeto y tiene las propiedades que buscamos.
  if (typeof e === 'object' && e !== null) {
    if (
      'messageKey' in e &&
      typeof (e as { messageKey: unknown }).messageKey === 'string'
    ) {
      messageKey = (e as { messageKey: string }).messageKey;
    }
    if (
      'message' in e &&
      typeof (e as { message: unknown }).message === 'string'
    ) {
      fallbackMessage = (e as { message: string }).message;
    }
  }

  return { messageKey, fallbackMessage };
};
