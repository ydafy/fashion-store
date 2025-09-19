import { API_BASE_URL } from '../../config/api';
import { PaymentMethod } from '../../types/payment';
// ✨ 1. IMPORTAMOS EL TIPO DE DATO TOKENIZADO
import { TokenizedPaymentData } from '../paymentGateway';

const API_URL = `${API_BASE_URL}/api/payment-methods`;

/**
 * Obtiene todos los métodos de pago del usuario desde la API.
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch payment methods');
  }
  return response.json();
};

/**
 * ✨ 2. LA CORRECCIÓN CLAVE ESTÁ AQUÍ ✨
 * La función ahora acepta el payload 'TokenizedPaymentData' que le pasa el hook.
 */
export const addPaymentMethod = async (
  tokenizedDetails: TokenizedPaymentData,
): Promise<PaymentMethod> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Envía el objeto tokenizado directamente al backend
    body: JSON.stringify(tokenizedDetails),
  });
  if (!response.ok) {
    throw new Error('Failed to add payment method');
  }
  // El backend nos devolverá un objeto 'PaymentMethod' completo (con brand y last4)
  return response.json();
};

/**
 * Establece un método de pago como predeterminado a través de la API.
 */
export const setDefaultPaymentMethod = async (
  methodId: string,
): Promise<PaymentMethod[]> => {
  const response = await fetch(`${API_URL}/${methodId}/set-default`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to set default payment method');
  }
  return response.json();
};

/**
 * Elimina un método de pago por su ID a través de la API.
 */
export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${methodId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete payment method');
  }
};
