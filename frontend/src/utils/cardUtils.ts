import { BrandName } from '../components/common/BrandIcon';

// ✨ RESTAURAMOS ESTA FUNCIÓN PARA USO VISUAL ✨
export const detectCardBrand = (cardNumber: string): BrandName => {
  const sanitized = cardNumber.replace(/\D/g, '');

  if (/^4/.test(sanitized)) return 'Visa';
  if (/^5[1-5]/.test(sanitized)) return 'Mastercard';
  if (/^3[47]/.test(sanitized)) return 'American Express';
  if (/^6(?:011|5)/.test(sanitized)) return 'Discover';

  return 'Unknown';
};

/**
 * @description Formatea un número de tarjeta de crédito añadiendo espacios.
 */
export const formatCardNumber = (cardNumber: string): string => {
  const sanitized = cardNumber.replace(/\D/g, '');
  const matches = sanitized.match(/(\d{1,4})/g);
  return matches ? matches.join(' ') : '';
};
