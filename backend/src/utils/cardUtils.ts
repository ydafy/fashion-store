// Este tipo debe coincidir con el que tenemos en `backend/src/types/payment.ts`
type CardBrand =
  | 'Visa'
  | 'Mastercard'
  | 'American Express'
  | 'Discover'
  | 'Unknown';

/**
 * @description Detecta la marca de una tarjeta de crédito basándose en su número.
 * @param {string} cardNumber - El número de la tarjeta, puede o no tener espacios.
 * @returns {CardBrand} El nombre de la marca de la tarjeta.
 */
export const detectCardBrand = (cardNumber: string): CardBrand => {
  const sanitized = cardNumber.replace(/\D/g, '');

  if (/^4/.test(sanitized)) return 'Visa';
  if (/^5[1-5]/.test(sanitized)) return 'Mastercard';
  if (/^3[47]/.test(sanitized)) return 'American Express';
  if (/^6(?:011|5)/.test(sanitized)) return 'Discover';

  return 'Unknown';
};
